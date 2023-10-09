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
exports.preparingCallingAudio = exports.getCallingAudiobyDisplay = void 0;
const fs_1 = __importDefault(require("fs"));
const filtering_1 = require("../utils/filtering");
const audio_manager_1 = require("../services/audio.manager");
const string_compose_1 = require("../utils/string.compose");
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
const preparingCallingAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, filtering_1.stringToUUID)(req.params.uuid);
    const body = req.body;
    try {
        if (uuid === null) {
            return res.status(400).json({ success: false, message: "The UUID param in URL is mailformed" });
        }
        const resp = yield (0, audio_manager_1.prepareCallingAudio)({
            uuid,
            params: (0, string_compose_1.prepareCallAudioInfo)(body.secuencia_ticket, body.department, body.service)
        });
        console.log(`Audio processed and exported successfully on path ${resp.result}`);
        return res.json({ success: true, message: "Audio processed and exported successfully", data: resp });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error trying process audio", data: error });
    }
});
exports.preparingCallingAudio = preparingCallingAudio;
