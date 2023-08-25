"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueCallAudio = exports.recordSchema = void 0;
const zod_1 = require("zod");
exports.recordSchema = zod_1.z.object({});
exports.getQueueCallAudio = zod_1.z.object({
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        number: zod_1.z.coerce.number().gte(1).lte(99),
        letters: zod_1.z.string().min(3).max(3)
            .regex(/^[A-Z]+$/, "Letters must be in UPPERCASE"),
        department: zod_1.z.coerce.string().max(5)
            .regex(/^[A-Z0-9]+$/, "Department abrev must be in UPPERCASE and optional a number"),
        service: zod_1.z.coerce.string().max(3)
            .regex(/^[A-Z]+$/, "Service abrev must be in UPPERCASE").optional(),
    }),
    body: zod_1.z.object({})
});
