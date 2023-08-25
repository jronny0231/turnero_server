"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const records_controller_1 = require("../controllers/records.controller");
const global_state_1 = require("./global.state");
const initialize = () => {
    (0, global_state_1.initData)();
    (0, records_controller_1.loadAudioFilesPath)();
};
exports.initialize = initialize;
