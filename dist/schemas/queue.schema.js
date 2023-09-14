"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendingQueueState = exports.createAttendingQueueState = exports.updateQueueState = exports.createQueueWithClient = exports.createQueueState = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const client_schema_1 = require("./client.schema");
const attendingQueueStateSchema = zod_1.z.object({
    turno_id: zod_1.z.coerce.number().gte(1),
    agente_id: zod_1.z.coerce.number().gte(1),
    servicio_id: zod_1.z.coerce.number().gte(1),
    estado_turno_id: zod_1.z.coerce.number().gte(1),
    razon_cancelado_id: zod_1.z.coerce.number().gte(1),
    estatus_llamada: zod_1.z.nativeEnum(client_1.turno_llamada),
    hora_inicio: zod_1.z.coerce.date(),
    hora_fin: zod_1.z.coerce.date(),
    espera_segundos: zod_1.z.coerce.number().gte(0)
});
const queueStateSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    descripcion: zod_1.z.nativeEnum(client_1.Tipado_estados_turnos),
    siglas: zod_1.z.string().min(3).max(5).regex(/^[A-Z]+$/, "Letters must be in UPPERCASE"),
    color_hex: zod_1.z.string().min(4).max(7).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid an hex color value"),
});
const queueSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    secuencia_ticket: zod_1.z.string().length(5).regex(/^([A-Z]{3})(\d{2})+$/, "Must be a sequency of 3 UPPERCASE letters and 2 digits (incl. zero)"),
    servicio_actual_id: zod_1.z.coerce.number().gte(1),
    servicio_destino_id: zod_1.z.coerce.number().gte(1),
    estado_turno_id: zod_1.z.coerce.number().gte(1),
    tipo_turno: zod_1.z.nativeEnum(client_1.tipo_turno),
    cola_posicion: zod_1.z.coerce.number().gte(1),
    cliente: client_schema_1.createClientByQueue,
    cliente_id: zod_1.z.coerce.number().gte(1),
    sucursal_id: zod_1.z.coerce.number().gte(1),
    fecha_turno: zod_1.z.coerce.date(),
    registrado_por_id: zod_1.z.coerce.number().gte(1),
});
exports.createQueueState = zod_1.z.object({
    body: queueStateSchema.omit({ id: true })
});
exports.createQueueWithClient = zod_1.z.object({
    body: queueSchema.pick({
        servicio_destino_id: true,
        sucursal_id: true,
        cliente: true,
        cliente_id: true,
    }).partial({
        cliente_id: true,
    })
});
exports.updateQueueState = zod_1.z.object({
    params: queueSchema.pick({ id: true }),
    body: zod_1.z.object({
        agente_id: zod_1.z.number().gte(1),
        servicio_id: zod_1.z.number().gte(1),
        turno_id: zod_1.z.number().gte(1),
        estado_turno_id: zod_1.z.number().gte(1).lte(7),
        razon_cancelado_id: zod_1.z.number().gte(1),
    })
});
exports.createAttendingQueueState = zod_1.z.object({
    body: attendingQueueStateSchema.pick({
        turno_id: true,
        agente_id: true,
        servicio_id: true,
    })
});
exports.updateAttendingQueueState = zod_1.z.object({
    body: attendingQueueStateSchema.pick({
        agente_id: true,
        servicio_id: true,
        turno_id: true,
        estado_turno_id: true,
        razon_cancelado_id: true
    }).partial({
        razon_cancelado_id: true,
    })
});
