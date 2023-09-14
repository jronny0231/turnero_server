"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discriminateFilterService = exports.updateServices = exports.createServices = exports.createService = void 0;
const zod_1 = require("zod");
const serviceSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    descripcion: zod_1.z.string().min(1).max(50),
    nombre_corto: zod_1.z.string().min(1).max(20),
    prefijo: zod_1.z.string().min(1).max(3),
    grupo_id: zod_1.z.number().gte(3).lte(7),
    es_seleccionable: zod_1.z.boolean().optional(),
});
exports.createService = zod_1.z.object({
    body: serviceSchema.omit({ id: true })
});
exports.createServices = zod_1.z.object({
    body: zod_1.z.tuple([serviceSchema])
});
exports.updateServices = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().gte(1)
    }),
    body: serviceSchema.omit({ id: true }).partial()
});
exports.discriminateFilterService = zod_1.z.discriminatedUnion("serviceField", [
    zod_1.z.object({
        serviceField: zod_1.z.literal("id"),
        data: zod_1.z.tuple([zod_1.z.coerce.number().gte(1)])
    }),
    zod_1.z.object({
        serviceField: zod_1.z.literal("nombre_corto"),
        data: zod_1.z.tuple([zod_1.z.string().max(20)])
    }),
    zod_1.z.object({
        serviceField: zod_1.z.literal("prefijo"),
        data: zod_1.z.tuple([zod_1.z.string().min(3).max(3)
                .regex(/^[A-Z]+$/, "Letters must be in UPPERCASE")])
    })
]);
