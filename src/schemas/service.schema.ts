import { z } from 'zod'

const serviceSchema = z.object({
    id: z.coerce.number().gte(1),
    descripcion: z.string().min(1).max(50),
    nombre_corto: z.string().min(1).max(20),
    prefijo: z.string().min(1).max(3),
    grupo_id: z.number().gte(3).lte(7),
    es_seleccionable: z.boolean().optional(),
})

export const createService = z.object({
    body: serviceSchema.omit({ id: true })
})

export const createServices = z.object({
    body: z.tuple([ serviceSchema ])
})

export const updateServices = z.object({
    params: z.object({
        id: z.coerce.number().gte(1)
    }),
    body: serviceSchema.omit({ id: true }).partial()
})

export const discriminateFilterService = z.discriminatedUnion("serviceField", [
    z.object({
        serviceField: z.literal("id"),
        data: z.tuple([ z.coerce.number().gte(1) ])
    }),
    z.object({
        serviceField: z.literal("nombre_corto"),
        data: z.tuple([ z.string().max(20) ])
    }),
    z.object({
        serviceField: z.literal("prefijo"),
        data: z.tuple([ z.string().min(3).max(3)
            .regex(/^[A-Z]+$/,
            "Letters must be in UPPERCASE") ]) 
    })
])

export type createServiceType = z.infer<typeof createService>
export type createServicesType = z.infer<typeof createServices>
export type updateServicesType = z.infer<typeof updateServices>