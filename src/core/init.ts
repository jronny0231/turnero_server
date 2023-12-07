import 'dotenv/config';
import { init } from '../providers/redis.provider';
import { loadAudioFilesPath, loadExportedAudioFilesPath } from "../services/audio.manager";
import { Configuraciones, Permisos } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';
import prisma from '../models/db/prisma';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { store } from '../providers/redis.provider';

interface PermisosStore extends Omit<Permisos, 'id' | 'parent_id'> {
    parent_id?: number | null
}
interface ConfigStore extends Omit<Configuraciones, 'id' | 'parent_id'> {
    parent_id?: number | null
}

type ConfigFile = {
    Permisos: PermisosStore[],
    Configuraciones: ConfigStore[]
}

const CONFIG_DATA_FILE_PATH = path.join(path.resolve('./init', 'init-config.json'))
const SUPER_PERMISSIONS_FILE_PATH = path.join(path.resolve('./init', 'super-permissions.json'))

const initialize = () => {

    try {
        checkRedisConnection().then(() => {
            logger.info(`Redis connected!`, console.log)
            loadInRedisSuperUserPermissions()
                .then(() => logger.info(`Super User default permissions data Loaded!`, console.log));
        });

        checkDatabaseConnection().then(() => {
            logger.info(`Database connected!`, console.log)
            checkInitialDataOnDatabase()
                .then(() => logger.info(`Initial data Loaded!`, console.log));
        });

        checkVolumeMediaDirectories()
            .then(() => logger.info(`Volume media files and directories Verified!`, console.log));

    } catch (error) {
        logger.error(`Initializing error ${error}`, console.error)
        process.exit()
    }

}

const checkRedisConnection = async () => {

    const redis = await init()
    if (redis === null) throw new Error("Redis instance returns null");
}

const checkDatabaseConnection = async () => {
    try {
        await prisma.$connect()

    } catch (error) {
        if (error instanceof PrismaClientInitializationError)
            throw new Error(`Prisma connection error: ${error.message}`);
    }
}

const checkInitialDataOnDatabase = async () => {

    if (fs.existsSync(CONFIG_DATA_FILE_PATH) === false)
        throw new Error(`Config data file not exist on path: ${CONFIG_DATA_FILE_PATH}`);


    const stringConfigData = fs.readFileSync(CONFIG_DATA_FILE_PATH, { encoding: 'utf8' })

    const configData: ConfigFile = JSON.parse(stringConfigData)

    await prisma.$transaction([
        ...configData.Permisos.map(permiso => (
            prisma.permisos.upsert({
                where: { nombre: permiso.nombre },
                update: permiso,
                create: permiso
            })
        )),
        ...configData.Configuraciones.map(configuracion => (
            prisma.configuraciones.upsert({
                where: { clave: configuracion.clave },
                update: configuracion,
                create: configuracion
            })
        ))
    ])
}

const checkVolumeMediaDirectories = () => {
    return new Promise((resolve, reject) => {

        const VOLUME_PATH = process.env.VOLUME_PATH

        if (VOLUME_PATH === undefined) return reject("VOLUME_PATH constant is not defined in environment")

        const recordsPath = path.join(VOLUME_PATH, 'records')
        const recordsSubFolders = {
            letters: path.join(recordsPath, 'letters'),
            numbers: path.join(recordsPath, 'numbers'),
            services: path.join(recordsPath, 'services'),
            departments: path.join(recordsPath, 'departments'),
            utils: path.join(recordsPath, 'utils')
        }

        const anyFalsePath = Object.entries(recordsSubFolders)
            .map(([key, value]) => ({
                [key]: {
                    result: fs.existsSync(value),
                    path: value
                }
            }))
            .filter(entry => Object.values(entry)[0].result === false)

        if (Object.entries(anyFalsePath).length > 0)
            return reject(`Some records directory does not exist: ${JSON.stringify(anyFalsePath)}`)

        loadAudioFilesPath();
        loadExportedAudioFilesPath();

        resolve(true)
    })
}

const loadInRedisSuperUserPermissions = () => {
    return new Promise(async (resolve, reject) => {

        if (fs.existsSync(SUPER_PERMISSIONS_FILE_PATH) === false)
            return reject(`Super User Permissions data file not exist on path: ${SUPER_PERMISSIONS_FILE_PATH}`);


        const stringPermissions = fs.readFileSync(SUPER_PERMISSIONS_FILE_PATH, { encoding: 'utf8' })
        const permissions = JSON.parse(stringPermissions)

        const result = await store('super-permissions', permissions)
        if (result === false) return reject('Could not store super user permissions data on Redis.')

        return resolve(true)
    })
}

export { initialize }