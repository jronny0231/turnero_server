import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg'
import {path as ffprobe} from '@ffprobe-installer/ffprobe'
import { UUID } from 'crypto'
import { stringToUUID } from '../utils/filtering'
import { getFilesFromDirectory } from '../utils/file.helpers'

type typeFolder = {
    name: string
    path: string
    //buffer: fs.ReadStream 
}

type audioFilesType = {
    letters: Array<typeFolder>
    numbers: Array<typeFolder>
    services: Array<typeFolder>
    departments: Array<typeFolder>
    utils: Array<typeFolder>
}

type exportedFilesType = {
    uuid: UUID
    path: string
}

export type paramsType = {
    pos: number,
    type: keyof audioFilesType,
    name: string,
}

type callingAudioType = {
    params: Array<paramsType>
    uuid: UUID
}


const audioFiles: audioFilesType = {
    letters: [],
    numbers: [],
    services: [],
    departments: [],
    utils: [],
}


// List all exported files by display UUID in out directory
const exportedAudioFiles: Array<exportedFilesType> = []

// File extension for all file receive, processed and returned
const fileExtension = "wav";

// Absolute path for volume directory
const volume = process.env.VOLUME_PATH

if (volume === undefined) throw new Error("VOLUME_PATH environment constant not set");

// Main absolute path direction for audio resources
const mainPath = path.join(path.resolve(volume), 'records')

// Absolute directory for audio processed and exported
const outDir = path.join(mainPath, 'exports')

// Keep sleep call audio until process ends
let isWorking = false;

/**
 * Method to create a calling audio file from concat some audio files
 * in order and named with a unique uuid than display can call 
 * @param {uuid, Array of {position, folderType, name}} 
 * @returns Promise string
 */
export const prepareCallingAudio = async ({uuid, params}: callingAudioType) => {
    isWorking = true

    try {
        const resultsPath = params
            .sort((a,b) => a.pos - b.pos)
            .map(param => {

                const fileName = param.name.toUpperCase()
                
                let filePath: string | null = path.join(
                    mainPath,
                    param.type,
                    `${fileName}.${fileExtension}`)

                return {
                    name: fileName,
                    path: filePath
                }

            })

        const filePaths = resultsPath.map(file => file.path)

        const paramsName = resultsPath.map(file => file.name).join('')
        const fileName = `${uuid}_${paramsName}` // UUID_[params.name1params.name2...]

        if (fs.existsSync(path.join(outDir, `${fileName}.${fileExtension}`))) {
            isWorking = false
            return {
                result: path.join(outDir, `${fileName}.${fileExtension}`),
                isRefresh: false
            }
        }

        const renameResult = renameMatchedExportedFile(uuid, fileName) 
        if (renameResult === null) {
            throw new Error("Could not rename file.");
            
        }

        if (renameResult === false) {
            console.log("New exported audio file")
        }
 
        return {
            result: await concatAudioFiles(filePaths, fileName),
            isRefresh: await loadExportedAudioFilesPath()
        }

    } catch (error) {
        isWorking = false
        throw new Error(`Error trying concatenate audio files ${error}`);
        
    }
}

/**
 * Method to get a string file path from audio that will be call to display
 * using the display unique id (UUID). If not exist return null.
 * @param uuid 
 * @returns string path or null
 */
export const getExpotedAudioPathFromUUID = (uuid: UUID) => {

    if (isWorking) return null

    return getExportedAudioPath(uuid)
}

/**
 * Load all files in exported directory to a local in-memory
 * constant and used them in alghorithm.
 */
export const loadExportedAudioFilesPath = async () => {
    try {
        const files = await getFilesFromDirectory(outDir)

        exportedAudioFiles.length = 0 // Clear all array properties from exportedAudioFiles

        if (files === null) { return false }

        const formatted = files.map(file => {
            const uuid = stringToUUID(file.name.slice(0, file.name.indexOf("_"))) // UUID_[params.name1-params.name2...]
            if (uuid === null) return null

            return {
                uuid: uuid,
                path: file.path
            }
        }).filter(file => file) as exportedFilesType[]

        exportedAudioFiles.push(...formatted)

        return true
        
    } catch (error) {
        console.error(`Could not read exported audio files`, {error})
        return false
    }
}

/**
 * Load all files by directory inside records directory
 * to a local in-memory constant and used them in alghorithm
 */
export const loadAudioFilesPath = async () => {
    const keys = Object.keys(audioFiles)

    try {
        for (const key of keys) {
            const audioDir = path.join(mainPath, key)
            const folder = key as keyof audioFilesType
            const files = await getFilesFromDirectory(audioDir)

            audioFiles[folder].length = 0 // Clear all array properties from audioFiles

            if (files === null) { return false }

            audioFiles[folder].push(...files)
        }

        return true
        
    } catch (error) {
        console.error(`Could not read audio files`, {error})
        return false
    }
}

/**
 * Concat all audio file paths in a new audio file using fluent-ffmpeg
 * and return a promise with the absolute path from file.
 * @param paths 
 * @param outFileName 
 * @returns promise string path
 */
const concatAudioFiles = (paths: string[], outFileName: string): Promise<string> => {
    isWorking = true
    return new Promise((resolve, reject) => {
        try {
            const filePreSet = path.join(
                outDir,
                `${outFileName}.${fileExtension}`
            )

            const concat = ffmpeg("").setFfprobePath(ffprobe).setFfmpegPath(ffmpegPath)
            
            paths.forEach(path => {
                if (fs.existsSync(path) === false) {
                    throw new Error(`Cant find file with path: ${path}`)
                }
                concat.addInput(path)
            })
            
            concat.mergeToFile( filePreSet, './temp')
                .on('error', (e) => {
                    throw new Error(`Error trying merge files on ${filePreSet}, error: ${e}`)
                })
                .on('end', () => {
                    isWorking = false
                    return resolve(filePreSet)
                })
        } catch (error) {
            return reject(`Error on generateAudioFile: ${error}`)
        }
    })
}



/**
 * Method to rename exported file that matches with display UUID
 * - true if complete
 * - false if couldnt find file
 * - null if occur an error
 * @param uuid 
 * @param newName 
 * @returns boolean | null
 */
const renameMatchedExportedFile = (uuid: UUID, newName: string) => {
    const oldFile = getExportedAudioPath(uuid)

    if (oldFile === null) { return false }

    if (fs.existsSync(oldFile) === false) { return false }

    const newPath = path.join(outDir, `${newName}.${fileExtension}`)

    try {
        fs.renameSync(oldFile, newPath)
        return true

    } catch (error) {
        console.error(`Could not rename file '${oldFile}' to '${newName}' with uuid '${uuid}'`, {error})
        return null
    }
}

/**
 * Returns a path from exported audio file that match with display UUID,
 * exist in local array files path and exports folder
 * @param uuid 
 * @returns string path or null
 */
const getExportedAudioPath = (uuid: UUID) => {
    const filter = exportedAudioFiles.filter(file => (file.uuid === uuid) )

    if (filter.length === 0) {
        loadExportedAudioFilesPath()
        return null
    }

    const {path} = filter[0]

    if (fs.existsSync(path) === false) return null

    return path
}