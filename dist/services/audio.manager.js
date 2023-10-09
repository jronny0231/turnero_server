"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAudioFilesPath = exports.loadExportedAudioFilesPath = exports.getExpotedAudioPathFromUUID = exports.prepareCallingAudio = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const ffprobe_1 = require("@ffprobe-installer/ffprobe");
const filtering_1 = require("../utils/filtering");
const audioFiles = {
    letters: [],
    numbers: [],
    services: [],
    department: [],
    utils: [],
};
// List all exported files by display UUID in out directory
const exportedAudioFiles = [];
// File extension for all file receive, processed and returned
const fileExtension = "wav";
// Absolute path for volume directory
const volume = process.env.VOLUME_PATH;
if (volume === undefined)
    throw new Error("VOLUME_PATH environment constant not set");
// Main absolute path direction for audio resources
const mainPath = path_1.default.join(path_1.default.resolve(volume), 'records');
// Absolute directory for audio processed and exported
const outDir = path_1.default.join(mainPath, 'exports');
// Keep sleep call audio until process ends
let isWorking = false;
/**
 * Method to create a calling audio file from concat some audio files
 * in order and named with a unique uuid than display can call
 * @param {uuid, Array of {position, folderType, name}}
 * @returns Promise string
 */
const prepareCallingAudio = ({ uuid, params }) => __awaiter(void 0, void 0, void 0, function* () {
    isWorking = true;
    try {
        const resultsPath = params
            .sort((a, b) => a.pos - b.pos)
            .map(param => {
            const fileName = param.name.toUpperCase();
            let filePath = path_1.default.join(mainPath, param.type, `${fileName}.${fileExtension}`);
            return {
                name: fileName,
                path: filePath
            };
        });
        const filePaths = resultsPath.map(file => file.path);
        const paramsName = resultsPath.map(file => file.name).join('');
        const fileName = `${uuid}_${paramsName}`; // UUID_[params.name1params.name2...]
        if (fs_1.default.existsSync(path_1.default.join(outDir, `${fileName}.${fileExtension}`))) {
            isWorking = false;
            return {
                result: path_1.default.join(outDir, `${fileName}.${fileExtension}`),
                isRefresh: false
            };
        }
        const renameResult = renameMatchedExportedFile(uuid, fileName);
        if (renameResult === null) {
            throw new Error("Could not rename file.");
        }
        if (renameResult === false) {
            console.log("New exported audio file");
        }
        return {
            result: yield concatAudioFiles(filePaths, fileName),
            isRefresh: yield (0, exports.loadExportedAudioFilesPath)()
        };
    }
    catch (error) {
        isWorking = false;
        throw new Error(`Error trying concatenate audio files ${error}`);
    }
});
exports.prepareCallingAudio = prepareCallingAudio;
/**
 * Method to get a string file path from audio that will be call to display
 * using the display unique id (UUID). If not exist return null.
 * @param uuid
 * @returns string path or null
 */
const getExpotedAudioPathFromUUID = (uuid) => {
    if (isWorking)
        return null;
    return getExportedAudioPath(uuid);
};
exports.getExpotedAudioPathFromUUID = getExpotedAudioPathFromUUID;
/**
 * Load all files in exported directory to a local in-memory
 * constant and used them in alghorithm.
 */
const loadExportedAudioFilesPath = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield getFilesFromDirectory(outDir);
        exportedAudioFiles.length = 0; // Clear all array properties from exportedAudioFiles
        if (files === null) {
            return false;
        }
        const formatted = files.map(file => {
            const uuid = (0, filtering_1.stringToUUID)(file.name.slice(0, file.name.indexOf("_"))); // UUID_[params.name1-params.name2...]
            if (uuid === null)
                return null;
            return {
                uuid: uuid,
                path: file.path
            };
        }).filter(file => file);
        exportedAudioFiles.push(...formatted);
        return true;
    }
    catch (error) {
        console.error(`Could not read exported audio files`, { error });
        return false;
    }
});
exports.loadExportedAudioFilesPath = loadExportedAudioFilesPath;
/**
 * Load all files by directory inside records directory
 * to a local in-memory constant and used them in alghorithm
 */
const loadAudioFilesPath = () => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(audioFiles);
    try {
        for (const key of keys) {
            const audioDir = path_1.default.join(mainPath, key);
            const folder = key;
            const files = yield getFilesFromDirectory(audioDir);
            audioFiles[folder].length = 0; // Clear all array properties from audioFiles
            if (files === null) {
                return false;
            }
            audioFiles[folder].push(...files);
        }
        return true;
    }
    catch (error) {
        console.error(`Could not read audio files`, { error });
        return false;
    }
});
exports.loadAudioFilesPath = loadAudioFilesPath;
/**
 * Concat all audio file paths in a new audio file using fluent-ffmpeg
 * and return a promise with the absolute path from file.
 * @param paths
 * @param outFileName
 * @returns promise string path
 */
const concatAudioFiles = (paths, outFileName) => {
    isWorking = true;
    return new Promise((resolve, reject) => {
        try {
            const filePreSet = path_1.default.join(outDir, `${outFileName}.${fileExtension}`);
            const concat = (0, fluent_ffmpeg_1.default)("").setFfprobePath(ffprobe_1.path).setFfmpegPath(ffmpeg_1.path);
            paths.forEach(path => {
                if (fs_1.default.existsSync(path) === false) {
                    throw new Error(`Cant find file with path: ${path}`);
                }
                concat.addInput(path);
            });
            concat.mergeToFile(filePreSet, './temp')
                .on('error', (e) => {
                throw new Error(`Error trying merge files on ${filePreSet}, error: ${e}`);
            })
                .on('end', () => {
                isWorking = false;
                return resolve(filePreSet);
            });
        }
        catch (error) {
            return reject(`Error on generateAudioFile: ${error}`);
        }
    });
};
/**
 * Method to return a map from files that exist in directory path
 * @param dirPath
 * @returns
 */
const getFilesFromDirectory = (dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs_1.default.promises.readdir(dirPath);
        return files.map(file => {
            const filePath = path_1.default.join(dirPath, file);
            //const fileBuffer = fs.createReadStream(filePath)
            //const fileBuffer = wav.decode(readStream)
            return {
                name: file.slice(0, file.indexOf('.')),
                path: filePath,
                //buffer: fileBuffer
            };
        });
    }
    catch (error) {
        console.error(`Could not read files from directory: ${dirPath}`, { error });
        return null;
    }
});
/**
 * Method to rename exported file that matches with display UUID
 * - true if complete
 * - false if couldnt find file
 * - null if occur an error
 * @param uuid
 * @param newName
 * @returns boolean | null
 */
const renameMatchedExportedFile = (uuid, newName) => {
    const oldFile = getExportedAudioPath(uuid);
    if (oldFile === null) {
        return false;
    }
    if (fs_1.default.existsSync(oldFile) === false) {
        return false;
    }
    const newPath = path_1.default.join(outDir, `${newName}.${fileExtension}`);
    try {
        fs_1.default.renameSync(oldFile, newPath);
        return true;
    }
    catch (error) {
        console.error(`Could not rename file '${oldFile}' to '${newName}' with uuid '${uuid}'`, { error });
        return null;
    }
};
/**
 * Returns a path from exported audio file that match with display UUID,
 * exist in local array files path and exports folder
 * @param uuid
 * @returns string path or null
 */
const getExportedAudioPath = (uuid) => {
    const filter = exportedAudioFiles.filter(file => (file.uuid === uuid));
    if (filter.length === 0) {
        (0, exports.loadExportedAudioFilesPath)();
        return null;
    }
    const { path } = filter[0];
    if (fs_1.default.existsSync(path) === false)
        return null;
    return path;
};
