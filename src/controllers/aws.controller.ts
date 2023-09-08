import { Request, Response } from 'express';
import { getFile, getFileList } from '../providers/aws.s3.provider';

export const getAllFileList = async (_req: Request, res: Response) => {
    const result = await getFileList()

    try {
        if (result === undefined) {
            return res.status(404).json({success: false, message: 'Error, files not found.'})
        }
    
        return res.json({success: true, message: `Files found, total ${result.length}`, data: result})

    } catch (error) {
        return res.status(500).json({success: false, message: "Error in server trying to get all files in AWS", data: error})
    }
}

export const getFileByKey = async (req: Request, res: Response) => {
    const key = req.params.key;

    try {
        const result = await getFile(key)

        if (result === undefined) {
            return res.status(404).json({success: false, message: 'Error, file not found.'})
        }

        return res.json({success: true, message: `File found`, data: result})

    } catch (error) {
        return res.status(500).json({success: false, message: "Error in server trying to get file by key in AWS", data: error})
    }
}
