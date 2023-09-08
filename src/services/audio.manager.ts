import path from 'path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg'
import {path as ffprobe} from '@ffprobe-installer/ffprobe'
import { UUID } from 'crypto'
import { stringToUUID } from '../utils/filtering'

type typeFolder = {
    name: string
    path: string
    //buffer: fs.ReadStream 
}

type audioFilesType = {
    letters: Array<typeFolder>
    numbers: Array<typeFolder>
    services: Array<typeFolder>
    department: Array<typeFolder>
    utils: Array<typeFolder>
}

type exportedFilesType = {
    displayUUID: UUID
    path: string
}

export type paramsType = {
    pos: number,
    type: keyof audioFilesType,
    name: string,
}

type callingAudioType = {
    params: Array<paramsType>
    displayUUID: UUID
}


const audioFiles: audioFilesType = {
    letters: [],
    numbers: [],
    services: [],
    department: [],
    utils: [],
}


// List all exported files by display UUID in out directory
const exportedAudioFiles: Array<exportedFilesType> = []

// File extension for all file receive, processed and returned
const fileExtension = "wav";

// Main absolute path direction for audio resources
const mainPath = path.join(__dirname, 'records')

// Absolute directory for audio processed and exported
const outDir = path.join(__dirname, 'exports')

// Keep sleep call audio until process ends
let isWorking = false;

/**
 * Method to create a calling audio file from concat some audio files
 * in order and named with a unique displayUUID than display can call 
 * @param {displayUUID, Array of {position, folderType, name}} 
 * @returns Promise string
 */
export const prepareCallingAudio = async ({displayUUID, params}: callingAudioType) => {
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
        const fileName = `${displayUUID}_${paramsName}` // UUID_[params.name1params.name2...]

        if (fs.existsSync(path.join(outDir, `${fileName}.${fileExtension}`))) {
            isWorking = false
            return {
                result: path.join(outDir, `${fileName}.${fileExtension}`),
                isRefresh: false
            }
        }

        const renameResult = renameMatchedExportedFile(displayUUID, fileName) 
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
        console.error("Error trying concatenate audio files", {error})
        return null
    }
}

/**
 * Method to get a string file path from audio that will be call to display
 * using the display unique id (UUID). If not exist return null.
 * @param displayUUID 
 * @returns string path or null
 */
export const getExpotedAudioPathFromUUID = (displayUUID: UUID) => {

    if (isWorking) return null

    return getExportedAudioPath(displayUUID)
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
                displayUUID: uuid,
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
 * Method to return a map from files that exist in directory path
 * @param dirPath 
 * @returns 
 */
const getFilesFromDirectory = async (dirPath: string) => {
    try {
        const files = await fs.promises.readdir(dirPath)
            
        return files.map(file => {
            const filePath = path.join(dirPath, file);
            //const fileBuffer = fs.createReadStream(filePath)
            //const fileBuffer = wav.decode(readStream)
            return {
                name: file.slice(0, file.indexOf('.')),
                path: filePath,
                //buffer: fileBuffer
            };
        })
    } catch (error) {
        console.error(`Could not read files from directory: ${dirPath}`, {error})
        return null
    }
}

/**
 * Method to rename exported file that matches with display UUID
 * - true if complete
 * - false if couldnt find file
 * - null if occur an error
 * @param displayUUID 
 * @param newName 
 * @returns boolean | null
 */
const renameMatchedExportedFile = (displayUUID: UUID, newName: string) => {
    const oldFile = getExportedAudioPath(displayUUID)

    if (oldFile === null) { return false }

    if (fs.existsSync(oldFile) === false) { return false }

    const newPath = path.join(outDir, `${newName}.${fileExtension}`)

    try {
        fs.renameSync(oldFile, newPath)
        return true

    } catch (error) {
        console.error(`Could not rename file '${oldFile}' to '${newName}' with displayUUID '${displayUUID}'`, {error})
        return null
    }
}

/**
 * Returns a path from exported audio file that match with display UUID,
 * exist in local array files path and exports folder
 * @param displayUUID 
 * @returns string path or null
 */
const getExportedAudioPath = (displayUUID: UUID) => {
    const filter = exportedAudioFiles.filter(file => (file.displayUUID === displayUUID) )

    if (filter.length === 0) {
        loadExportedAudioFilesPath()
        return null
    }

    const {path} = filter[0]

    if (fs.existsSync(path) === false) return null

    return path
}