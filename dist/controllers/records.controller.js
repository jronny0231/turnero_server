"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallingAudiobyDisplay = void 0;
const fs_1 = __importDefault(require("fs"));
const filtering_1 = require("../utils/filtering");
const audio_manager_1 = require("../services/audio.manager");
const getCallingAudiobyDisplay = (req, res) => {
    const uuid = (0, filtering_1.stringToUUID)(req.params.uuid);
    try {
        if (uuid === null) {
            return res.status(400).json({ success: false, message: "The UUID param in URL is mailformed" });
        }
        const pathFile = (0, audio_manager_1.getExpotedAudioPathFromUUID)(uuid);
        if (pathFile === null) {
            return res.status(404).json({ success: false, message: "The audio file does not exist, try later." });
        }
        res.setHeader('Content-Type', 'audio/wav');
        const stream = fs_1.default.createReadStream(pathFile);
        return stream.pipe(res);
    }
    catch (error) {
        console.error("Error trying get exported audio to call", { error });
        return res.status(500).json({ success: false, message: "Error trying get exported audio to call", data: error });
    }
};
exports.getCallingAudiobyDisplay = getCallingAudiobyDisplay;
