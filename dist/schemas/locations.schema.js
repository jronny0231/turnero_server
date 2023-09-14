"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocation = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    calle: zod_1.z.string().min(5).max(50),
    numero: zod_1.z.coerce.number().min(1),
    piso: zod_1.z.coerce.number().min(1),
    sector: zod_1.z.string().min(5).max(50),
    estado_provincia: zod_1.z.string().min(5).max(30),
    latitud_decimal: zod_1.z.string().min(10).max(20),
    longitud_decimal: zod_1.z.string().min(10).max(20),
});
exports.createLocation = zod_1.z.object({
    params: locationSchema.pick({}),
    query: locationSchema.pick({}),
    body: locationSchema.omit({
        id: true
    }).partial({
        latitud_decimal: true,
        longitud_decimal: true
    })
});
