"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchedule = exports.createSchedule = exports.createScheduleState = void 0;
const zod_1 = require("zod");
const client_schema_1 = require("./client.schema");
const scheduleTypeSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(3).max(10),
    descripcion: zod_1.z.string().min(3).max(50),
    servicio_destino_id: zod_1.z.coerce.number().gte(1)
});
const scheduleStateSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(3).max(15),
    descripcion: zod_1.z.string().min(3).max(50),
    color_hex: zod_1.z.string().min(4).max(7).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid an hex color value"),
});
const scheduleSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    clientes: zod_1.z.tuple([client_schema_1.createClient]),
    cliente_id: zod_1.z.coerce.number().gte(1),
    clientes_id: zod_1.z.tuple([zod_1.z.coerce.number().gte(1)]),
    descripcion: zod_1.z.string().min(3).max(50),
    tipo_visita: scheduleTypeSchema.omit({ id: true }),
    tipo_visita_id: zod_1.z.coerce.number().gte(1),
    estado_visita_id: zod_1.z.coerce.number().gte(1),
    fecha_hora_planificada: zod_1.z.coerce.date(),
    sucursal_id: zod_1.z.coerce.number().gte(1),
    comentario: zod_1.z.string().min(9).max(255),
    estatus: zod_1.z.boolean()
});
exports.createScheduleState = zod_1.z.object({
    body: scheduleStateSchema.omit({ id: true })
});
exports.createSchedule = zod_1.z.object({
    body: scheduleSchema.omit({
        id: true,
        estatus: true
    }).partial({
        clientes: true,
        cliente_id: true,
        tipo_visita: true,
        tipo_visita_id: true,
    })
});
exports.updateSchedule = zod_1.z.object({
    params: scheduleSchema.pick({
        id: true
    }),
    body: scheduleSchema.omit({
        id: true,
        clientes: true,
        tipo_visita: true,
    }).optional()
});
