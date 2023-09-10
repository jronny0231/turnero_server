"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOffice = exports.createOffice = void 0;
const zod_1 = require("zod");
const officeSchema = zod_1.z.object({
    descripcion: zod_1.z.string().min(4).max(30),
    siglas: zod_1.z.string().max(8)
        .regex(/^[A-Z]+$/, "Must contain only UPPERCASE character."),
    direccion_id: zod_1.z.number().gte(1),
});
exports.createOffice = zod_1.z.object({
    body: officeSchema
});
exports.updateOffice = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().gte(1)
    }),
    body: officeSchema.partial()
});
