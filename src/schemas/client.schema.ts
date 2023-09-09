import { z } from 'zod'
import { createLocation } from './locations.schema'
import { createRefer } from './refer.schema'


const seguroSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(5).max(60),
    nombre_corto: z.string().min(3).max(10),
    siglas: z.string().min(5).max(3).regex(
        /^[A-Z]+$/,
        "Letters must be in UPPERCASE"),
    estatus: z.boolean(),
})

const contactClientSchema = z.object({
    id: z.coerce.number().gte(1),
    cliente_id: z.coerce.number().gte(1),
    fecha_nacimiento: z.coerce.date().max(new Date(), { message: "Too young!" }),
    telefono: z.string().min(10).regex(
        /^(\(8[0,2,4]9\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/, // (809) 568-5555
            "The phone number must be a valid dominican number format"),
    celular: z.string().min(10),
    referido_id: z.coerce.number().gte(1),
    referimiento: createRefer,
    direccion_id: z.coerce.number().gte(1),
    direccion: createLocation
})

const clientSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(3).max(20),
    apellidos: z.string().min(3).max(30),
    tipo_identificacion_id: z.coerce.number().gte(1).lte(3),
    identificacion: z.string().min(9).max(20),
    seguro: seguroSchema.omit({ id: true }),
    seguro_id: z.coerce.number().gte(0),
    es_tutor: z.coerce.boolean(),
    nombre_tutorado: z.string().min(3).max(20),
    fecha_ultima_visita: z.coerce.date(),
    estatus: z.boolean(),
    contacto: contactClientSchema
})

export const createClient = z.object({
    body: clientSchema.omit({
        id: true,
        fecha_ultima_visita: true,
        estatus: true
    }).partial({
        seguro_id: true,
        contacto: true,
        seguro: true,
    })
})

export const createClientByQueue = z.object({
    body: clientSchema.pick({
        tipo_identificacion_id: true,
        identificacion: true,
        seguro_id: true,
        es_tutor: true,
    }).partial({
        seguro_id: true
    })
})

export const updateClient = z.object({
    params: clientSchema.pick({
        id: true
    }),
    query: clientSchema.pick({ }),
    body: clientSchema.omit({
        id: true,
        seguro: true,
    }).partial()
})



export type createClientType = z.infer<typeof createClient>
export type createClientByQueueType = z.infer<typeof createClientByQueue>
export type updateClientType = z.infer<typeof updateClient>