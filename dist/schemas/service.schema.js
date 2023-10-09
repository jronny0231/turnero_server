"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discriminateFilterService = exports.updateServices = exports.createServices = exports.createService = exports.updateServiceGroup = exports.createServicesGroup = exports.createServiceGroup = void 0;
const zod_1 = require("zod");
const serviceGroupSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    descripcion: zod_1.z.string().min(1).max(25),
    es_seleccionable: zod_1.z.boolean(),
    color_hex: zod_1.z.string().min(4).max(7).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid an hex color value"),
});
exports.createServiceGroup = zod_1.z.object({
    body: serviceGroupSchema
        .omit({
        id: true
    }).partial({
        es_seleccionable: true
    })
});
exports.createServicesGroup = zod_1.z.object({
    body: zod_1.z.tuple([
        serviceGroupSchema
            .omit({
            id: true
        }).partial({
            es_seleccionable: true
        })
    ])
});
exports.updateServiceGroup = zod_1.z.object({
    params: serviceGroupSchema.pick({ id: true }),
    body: serviceGroupSchema.omit({ id: true }).partial()
});
const serviceSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    descripcion: zod_1.z.string().min(1).max(50),
    nombre_corto: zod_1.z.string().min(1).max(20),
    prefijo: zod_1.z.string().min(1).max(3),
    grupo_id: zod_1.z.number().gte(3).lte(7),
    grupo: exports.createServiceGroup.pick({ body: true }),
    es_seleccionable: zod_1.z.boolean().optional(),
});
exports.createService = zod_1.z.object({
    body: serviceSchema
        .omit({
        id: true
    }).partial({
        es_seleccionable: true,
        grupo_id: true,
        grupo: true,
    })
});
exports.createServices = zod_1.z.object({
    body: zod_1.z.tuple([
        serviceSchema
            .omit({
            id: true
        }).partial({
            es_seleccionable: true,
            grupo: true,
            grupo_id: true
        })
    ])
});
exports.updateServices = zod_1.z.object({
    params: serviceGroupSchema.pick({ id: true }),
    body: serviceSchema.omit({
        id: true,
        grupo: true,
    }).partial()
});
exports.discriminateFilterService = zod_1.z.discriminatedUnion("serviceField", [
    zod_1.z.object({
        serviceField: zod_1.z.literal("id"),
        data_id: zod_1.z.tuple([zod_1.z.coerce.number().gte(1)])
    }),
    zod_1.z.object({
        serviceField: zod_1.z.literal("nombre_corto"),
        data_short: zod_1.z.tuple([zod_1.z.string().max(20)])
    }),
    zod_1.z.object({
        serviceField: zod_1.z.literal("prefijo"),
        data_prefix: zod_1.z.tuple([zod_1.z.string().min(3).max(3)
                .regex(/^[A-Z]+$/, "Letters must be in UPPERCASE")])
    })
]);
