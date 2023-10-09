import { Request, Response } from 'express'
import fs from 'fs'
import { stringToUUID } from '../utils/filtering'
import { getExpotedAudioPathFromUUID, prepareCallingAudio } from '../services/audio.manager'
import { prepareCallAudioInfo } from '../utils/string.compose'
import { setQueueCallAudioType } from '../schemas/records.schema'

export const getCallingAudiobyDisplay = (req: Request, res: Response) => {
    
    try {
        const uuid = stringToUUID(req.params.uuid)

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

export const preparingCallingAudio = async (req: Request, res: Response) => {
    const body: setQueueCallAudioType['body'] = req.body

    try {
        const uuid = stringToUUID(body.uuid)

        if (uuid === null) {
            return res.status(400).json({success: false, message: "The UUID param in URL is mailformed"})
        }

        const resp = await prepareCallingAudio({
            uuid,
            params: prepareCallAudioInfo(
                body.secuencia_ticket,
                body.departamento,
                body.servicio
            )
        })

        console.log(`Audio processed and exported successfully on path ${resp.result}`)

        return res.json({success: true, message: "Audio processed and exported successfully", data: resp})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success: false, message: "Error trying process audio", data: error})
    }
}