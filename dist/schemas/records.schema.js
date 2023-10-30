"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueCallAudio = exports.setQueueCallAudio = exports.recordSchema = void 0;
const zod_1 = require("zod");
exports.recordSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid(),
    secuencia_ticket: zod_1.z.string().length(5).regex(/^([A-Z]{3})(\d{2})+$/, "Must be a sequency of 3 UPPERCASE letters and 2 digits (incl. zero)"),
    servicio: zod_1.z.string().length(3),
    departamento: zod_1.z.string(),
});
exports.setQueueCallAudio = zod_1.z.object({
    body: exports.recordSchema.partial({
        servicio: true,
    })
});
exports.getQueueCallAudio = zod_1.z.object({
    params: exports.recordSchema.pick({ uuid: true }),
});
