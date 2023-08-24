"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const global_state_1 = require("./global.state");
const initialize = () => {
    (0, global_state_1.refreshPersistentData)();
    (0, global_state_1.refreshQueueState)();
};
exports.initialize = initialize;
