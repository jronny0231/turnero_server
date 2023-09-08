import { Request, Response } from 'express'
import fs from 'fs'
import { stringToUUID } from '../utils/filtering'
import { getExpotedAudioPathFromUUID } from '../services/audio.manager'

export const getCallingAudiobyDisplay = (req: Request, res: Response) => {
    const uuid = stringToUUID(req.params.uuid)

    try {
        if (uuid === null) {
            return res.status(400).json({success: false, message: "The UUID param in URL is mailformed"})
        }

        const pathFile = getExpotedAudioPathFromUUID(uuid)

        if (pathFile === null) {
            return res.status(404).json({success: false, message: "The audio file does not exist, try later."})
        }
        
        res.setHeader('Content-Type', 'audio/wav');
        
        const stream = fs.createReadStream(pathFile)
        
        return stream.pipe(res)

    } catch (error) {
        console.error("Error trying get exported audio to call", {error})
        return res.status(500).json({success: false, message: "Error trying get exported audio to call", data: error})
    }
}