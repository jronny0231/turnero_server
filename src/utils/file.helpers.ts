import fs from 'fs';
import path from 'path';
import logger from './logger';

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
        logger.error(`Could not read files from directory: ${dirPath}: ${error}`, console.error);
        return null
    }
}

const verifyOrCreateFolder = (path: string) => {
    if (fs.existsSync(path) === false) {
        fs.mkdirSync(path)
    }
}

export {
    getFilesFromDirectory,
    verifyOrCreateFolder
}