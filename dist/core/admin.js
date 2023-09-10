"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const audio_manager_1 = require("../services/audio.manager");
const global_state_1 = require("./global.state");
const initialize = () => {
    (0, global_state_1.initData)();
    (0, audio_manager_1.loadAudioFilesPath)();
    (0, audio_manager_1.loadExportedAudioFilesPath)();
};
exports.initialize = initialize;
