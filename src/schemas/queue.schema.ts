import { Tipado_estados_turnos, tipo_turno, turno_llamada } from '@prisma/client'
import { z } from 'zod'
import { createClientByQueue } from './client.schema'


const attendingQueueStateSchema = z.object({
    turno_id: z.coerce.number().gte(1),
    agente_id: z.coerce.number().gte(1),
    servicio_id: z.coerce.number().gte(1),
    estado_turno_id: z.coerce.number().gte(1),
    razon_cancelado_id: z.coerce.number().gte(1),
    estatus_llamada: z.nativeEnum(turno_llamada),
    hora_inicio: z.coerce.date(),
    hora_fin: z.coerce.date(),
    espera_segundos: z.coerce.number().gte(0)
})

const queueStateSchema = z.object({
    id: z.coerce.number().gte(1),
    descripcion: z.nativeEnum(Tipado_estados_turnos),
    siglas: z.string().min(3).max(5).regex(
        /^[A-Z]+$/,
        "Letters must be in UPPERCASE"),
    color_hex: z.string().min(4).max(7).regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Must be a valid an hex color value"),
})

const queueSchema = z.object({
    id: z.coerce.number().gte(1),
    secuencia_ticket: z.string().length(5).regex(
        /^([A-Z]{3})(\d{2})+$/,
        "Must be a sequency of 3 UPPERCASE letters and 2 digits (incl. zero)"),
    servicio_actual_id: z.coerce.number().gte(1),
    servicio_destino_id: z.coerce.number().gte(1),
    estado_turno_id: z.coerce.number().gte(1),
    tipo_turno: z.nativeEnum(tipo_turno),
    cola_posicion: z.coerce.number().gte(1),
    cliente: createClientByQueue,
    cliente_id: z.coerce.number().gte(1),
    sucursal_id: z.coerce.number().gte(1),
    fecha_turno: z.coerce.date(),
    registrado_por_id: z.coerce.number().gte(1),
})

export const createQueueState = z.object({
    body: queueStateSchema.omit({ id: true })
})

export const createQueueWithClient = z.object({
    body: queueSchema.pick({
        servicio_destino_id: true,
        sucursal_id: true,
        cliente: true,
        cliente_id: true,
    }).partial({
        cliente_id: true,
    })
})

export const updateQueueState = z.object({
    params: queueSchema.pick({ id: true }),

    body: z.object({
        agente_id: z.number().gte(1),
        servicio_id: z.number().gte(1),
        turno_id: z.number().gte(1),
        estado_turno_id: z.number().gte(1).lte(7),
        razon_cancelado_id: z.number().gte(1),
    })
})

export const createAttendingQueueState = z.object({
    body: attendingQueueStateSchema.pick({
        turno_id: true,
        agente_id: true,
        servicio_id: true,
    })
})
export const updateAttendingQueueState = z.object({
    body: attendingQueueStateSchema.pick({
        agente_id: true,
        servicio_id: true,
        turno_id: true,
        estado_turno_id: true,
        razon_cancelado_id: true
    }).partial({
        razon_cancelado_id: true,
    })
})

export type newQueueWithClientType = z.infer<typeof createQueueWithClient>["body"]
export type updateQueueStateType = z.infer<typeof updateQueueState>
export type updateAttendingQueueStateType = z.infer<typeof updateAttendingQueueState>