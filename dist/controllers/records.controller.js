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
exports.loadAudioFilesPath = exports.streamAudio = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const ffprobe_1 = require("@ffprobe-installer/ffprobe");
const audioFiles = {
    letters: [],
    numbers: [],
    services: [],
    department: [],
    utils: [],
};
const mainPath = path_1.default.join(path_1.default.resolve('./public'), 'records');
const outFile = path_1.default.join(path_1.default.resolve('./src/exports'), 'call.wav');
const streamAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filesStream = Object.entries(query).map(([key, name], elem) => {
        const folder = key;
        const result = [];
        if (folder === 'letters') {
            name.toString().split("").forEach((letter, i) => {
                result.push({
                    order: i + 1 * (elem + 1),
                    path: audioFiles.letters.filter(audio => audio.name === letter)[0].path
                });
            });
        }
        if (folder === 'number') {
            const value = name;
            const decimalsAfterTen = [2, 3, 4, 5, 6, 7, 8, 9].map(num => num * 10);
            // Number is lower o equal than 20 or decimal entire like 30, 40...
            if (value <= 20 || decimalsAfterTen.includes(value)) {
                console.log({ value });
                result.push({
                    order: 4 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === value.toString())[0].path
                });
            }
            else {
                const [decimal, unit] = value.toString().split("");
                result.push({
                    order: 4 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === decimal + "0")[0].path
                });
                result.push({
                    order: 5 * (elem + 1),
                    path: audioFiles.numbers.filter(audio => audio.name === "X" + unit.toString())[0].path
                });
            }
        }
        if (folder === 'department') {
            result.push({
                order: 6 * (elem + 1),
                path: audioFiles[folder].filter(audio => audio.name === name)[0].path
            });
        }
        if (folder === 'service') {
            result.push({
                order: 7 * (elem + 1),
                path: audioFiles.utils.filter(audio => audio.name === 'para')[0].path
            });
            result.push({
                order: 8 * (elem + 1),
                path: audioFiles.services.filter(audio => audio.name === name)[0].path
            });
        }
        return result;
    }).flat().sort((a, b) => a.order - b.order).map(entry => entry.path);
    //const result = combineStreams(filesStream)
    res.setHeader('Content-Type', 'audio/wav');
    const concat = (0, fluent_ffmpeg_1.default)("").setFfprobePath(ffprobe_1.path).setFfmpegPath(ffmpeg_1.path);
    filesStream.forEach(path => {
        concat.addInput(path);
    });
    concat.mergeToFile(outFile, './temp');
    concat.on('end', () => {
        const stream = fs_1.default.createReadStream(outFile);
        stream.pipe(res);
    });
});
exports.streamAudio = streamAudio;
const loadAudioFilesPath = () => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(audioFiles);
    // Clear all array properties from audioFiles
    keys.forEach((key) => {
        audioFiles[key].length = 0;
    });
    try {
        for (const key of keys) {
            const audioDir = path_1.default.join(mainPath, key);
            const folder = key;
            const files = yield fs_1.default.promises.readdir(audioDir);
            files.forEach(file => {
                const filePath = path_1.default.join(audioDir, file);
                //const fileBuffer = fs.createReadStream(filePath)
                //const fileBuffer = wav.decode(readStream)
                const fileInfo = {
                    name: file.slice(0, file.indexOf('.')),
                    path: filePath,
                    //buffer: fileBuffer
                };
                audioFiles[folder].push(fileInfo);
            });
        }
    }
    catch (error) {
        console.error(`Could not read audio files`, { error });
    }
});
exports.loadAudioFilesPath = loadAudioFilesPath;
