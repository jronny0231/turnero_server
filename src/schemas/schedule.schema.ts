import { z } from 'zod'
import { createClient } from './client.schema';

const scheduleTypeSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(3).max(10),
    descripcion: z.string().min(3).max(50),
    servicio_destino_id: z.coerce.number().gte(1)
});

const scheduleStateSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(3).max(15),
    descripcion: z.string().min(3).max(50),
    color_hex: z.string().min(4).max(7).regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Must be a valid an hex color value"),
})

const scheduleSchema = z.object({
    id: z.coerce.number().gte(1),
    clientes: z.tuple([ createClient ]),
    cliente_id: z.coerce.number().gte(1),
    clientes_id: z.tuple([z.coerce.number().gte(1)]),
    descripcion: z.string().min(3).max(50),
    tipo_visita: scheduleTypeSchema.omit({ id: true }),
    tipo_visita_id: z.coerce.number().gte(1),
    estado_visita_id: z.coerce.number().gte(1),
    fecha_hora_planificada: z.coerce.date(),
    sucursal_id: z.coerce.number().gte(1),
    comentario: z.string().min(9).max(255),
    estatus: z.boolean()
})

export const createScheduleState = z.object({
    body: scheduleStateSchema.omit({ id: true })
})

export const createSchedule = z.object({
    body: scheduleSchema.omit({
        id: true,
        estatus: true
    }).partial({
        clientes: true,
        cliente_id: true,
        tipo_visita: true,
        tipo_visita_id: true,
    })
})

export const updateSchedule = z.object({
    params: scheduleSchema.pick({
        id: true
    }),
    body: scheduleSchema.omit({
        id: true,
        clientes: true,
        tipo_visita: true,
    }).optional()
})



export type createScheduleType = z.infer<typeof createSchedule>
export type updateScheduleType = z.infer<typeof updateSchedule>
export type createScheduleStateType = z.infer<typeof createScheduleState>