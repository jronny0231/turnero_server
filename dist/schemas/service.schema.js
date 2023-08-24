"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServices = exports.createServices = void 0;
const zod_1 = require("zod");
exports.createServices = zod_1.z.object({
    body: zod_1.z.tuple([zod_1.z.object({
            descripcion: zod_1.z.string().min(1).max(50),
            nombre_corto: zod_1.z.string().min(1).max(20),
            prefijo: zod_1.z.string().min(1).max(3),
            grupo_id: zod_1.z.number().gte(3).lte(7),
        })])
});
exports.updateServices = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: zod_1.z.object({
        descripcion: zod_1.z.string().min(1).max(50).optional(),
        nombre_corto: zod_1.z.string().min(1).max(20).optional(),
        prefijo: zod_1.z.string().min(1).max(3).optional(),
        grupo_id: zod_1.z.number().gte(3).lte(7).optional(),
    })
});
