"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefer = void 0;
const zod_1 = require("zod");
const typeReferSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(0),
    nombre: zod_1.z.string().min(3).max(10),
    descripcion: zod_1.z.string().min(3).max(50),
});
const referSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(3).max(10),
    referencia: zod_1.z.string().min(3).max(30),
    tipo: typeReferSchema,
    tipo_id: zod_1.z.coerce.number().gte(1),
    descripcion: zod_1.z.string().min(3).max(100),
    localidad: zod_1.z.string().min(3).max(50),
    sector: zod_1.z.string().min(3).max(50),
    estado_provincia: zod_1.z.string().min(3).max(30),
});
exports.createRefer = zod_1.z.object({
    body: referSchema.omit({
        id: true,
    }).partial({
        tipo: true
    })
});
