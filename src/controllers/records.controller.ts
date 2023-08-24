import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { getQueueCallAudioType } from '../schemas/records.schema'
import ffmpeg from 'fluent-ffmpeg'
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg'
import {path as ffprobe} from '@ffprobe-installer/ffprobe'

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

const audioFiles: audioFilesType = {
    letters: [],
    numbers: [],
    services: [],
    department: [],
    utils: [],
}

const mainPath = path.join(path.resolve('./public'), 'records')
const outFile = path.join(path.resolve('./src/exports'),'call.wav')

export const streamAudio = async (req: Request, res: Response) => {
    const query = req.query as unknown as getQueueCallAudioType['query']

    const filesStream = Object.entries(query).map(([key, name], elem) => {
        const folder = key as keyof typeof query
        const result: {path: string, order: number}[] = []

        if (folder === 'letters') {
            name.toString().split("").forEach((letter, i) => {
                result.push({
                    order: i + 1 * (elem + 1),
                    path: audioFiles.letters.filter(audio => audio.name === letter)[0].path
                })
            })
        }

        if (folder === 'number') {
            const value: number = name as number
            const decimalsAfterTen = [2,3,4,5,6,7,8,9].map(num => num * 10)

            // Number is lower o equal than 20 or decimal entire like 30, 40...
            if (value <= 20 || decimalsAfterTen.includes(value)) {
                console.log({value})
                result.push({
                    order: 4 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === value.toString())[0].path
                })
            } else {
                const [decimal, unit] = value.toString().split("")
                result.push({
                    order: 4 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === decimal + "0")[0].path
                })
                result.push({
                    order: 5 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === "X" + unit.toString())[0].path
                })
            }
    }

        if (folder === 'department') {
            result.push({
                order: 6 * (elem + 1),
                path: audioFiles[folder].filter(audio => audio.name === name)[0].path
            })
        }

        if (folder === 'service') {
            result.push({
                order: 7 * (elem + 1),
                path: audioFiles.utils.filter(audio => audio.name === 'para')[0].path
            })
            result.push({
                order: 8 * (elem + 1),
                path: audioFiles.services.filter(audio => audio.name === name)[0].path
            })
        }
        return result
    }).flat().sort((a,b) => a.order - b.order).map(entry => entry.path)

    //const result = combineStreams(filesStream)
    
    res.setHeader('Content-Type', 'audio/wav');

    const concat = ffmpeg("").setFfprobePath(ffprobe).setFfmpegPath(ffmpegPath)

    filesStream.forEach(path => {
        concat.addInput(path)
    })

    concat.mergeToFile( outFile, './temp')
    concat.on('end', () => {
        const stream = fs.createReadStream(outFile)
        stream.pipe(res)
    })

}

export const loadAudioFilesPath = async () => {
    const keys = Object.keys(audioFiles)

    // Clear all array properties from audioFiles
    keys.forEach((key) => {
        audioFiles[key as keyof audioFilesType].length = 0
    })

    try {
        for (const key of keys) {
            const audioDir = path.join(mainPath, key)
            const folder = key as keyof audioFilesType
            const files = await fs.promises.readdir(audioDir)
            
            files.forEach(file => {
                const filePath = path.join(audioDir, file);
                //const fileBuffer = fs.createReadStream(filePath)
                //const fileBuffer = wav.decode(readStream)
                const fileInfo = {
                    name: file.slice(0, file.indexOf('.')),
                    path: filePath,
                    //buffer: fileBuffer
                };
                audioFiles[folder].push(fileInfo)
            })
        }
    } catch (error) {
        console.error(`Could not read audio files`, {error})
    }
}