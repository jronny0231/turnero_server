"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueCallAudio = exports.recordSchema = void 0;
const zod_1 = require("zod");
exports.recordSchema = zod_1.z.object({});
exports.getQueueCallAudio = zod_1.z.object({
    params: zod_1.z.object({
        uuid: zod_1.z.string().uuid()
    })
});
