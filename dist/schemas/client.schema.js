"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClient = exports.createClientByQueue = exports.createClient = void 0;
const zod_1 = require("zod");
const locations_schema_1 = require("./locations.schema");
const refer_schema_1 = require("./refer.schema");
const seguroSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(5).max(60),
    nombre_corto: zod_1.z.string().min(3).max(10),
    siglas: zod_1.z.string().min(5).max(3).regex(/^[A-Z]+$/, "Letters must be in UPPERCASE"),
    estatus: zod_1.z.boolean(),
});
const contactClientSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    cliente_id: zod_1.z.coerce.number().gte(1),
    fecha_nacimiento: zod_1.z.coerce.date().max(new Date(), { message: "Too young!" }),
    telefono: zod_1.z.string().min(10).regex(/^(\(8[0,2,4]9\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/, // (809) 568-5555
    "The phone number must be a valid dominican number format"),
    celular: zod_1.z.string().min(10),
    referido_id: zod_1.z.coerce.number().gte(1),
    referimiento: refer_schema_1.createRefer,
    direccion_id: zod_1.z.coerce.number().gte(1),
    direccion: locations_schema_1.createLocation
});
const clientSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(3).max(20),
    apellidos: zod_1.z.string().min(3).max(30),
    tipo_identificacion_id: zod_1.z.coerce.number().gte(1).lte(3),
    identificacion: zod_1.z.string().min(9).max(20),
    seguro: seguroSchema.omit({ id: true }),
    seguro_id: zod_1.z.coerce.number().gte(0),
    es_tutor: zod_1.z.coerce.boolean(),
    nombre_tutorado: zod_1.z.string().min(3).max(20),
    fecha_ultima_visita: zod_1.z.coerce.date(),
    estatus: zod_1.z.boolean(),
    contacto: contactClientSchema
});
exports.createClient = zod_1.z.object({
    body: clientSchema.omit({
        id: true,
        fecha_ultima_visita: true,
        estatus: true
    }).partial({
        seguro_id: true,
        contacto: true,
        seguro: true,
    })
});
exports.createClientByQueue = zod_1.z.object({
    body: clientSchema.pick({
        tipo_identificacion_id: true,
        identificacion: true,
        seguro_id: true,
        es_tutor: true,
    }).partial({
        seguro_id: true
    })
});
exports.updateClient = zod_1.z.object({
    params: clientSchema.pick({
        id: true
    }),
    query: clientSchema.pick({}),
    body: clientSchema.omit({
        id: true,
        seguro: true,
    }).partial()
});
