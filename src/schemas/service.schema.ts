import { z } from 'zod'


const serviceGroupSchema = z.object({
    id: z.coerce.number().gte(1),
    descripcion: z.string().min(1).max(25),
    es_seleccionable: z.boolean(),
    color_hex: z.string().min(4).max(7).regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Must be a valid an hex color value"),
})

export const createServiceGroup = z.object({
    body: serviceGroupSchema
        .omit({
            id: true
        }).partial({
            es_seleccionable: true
        })  
})

export const createServicesGroup = z.object({
    body: z.tuple([
        serviceGroupSchema
        .omit({
            id: true
        }).partial({
            es_seleccionable: true
        })
    ])
})

export const updateServiceGroup = z.object({
    params: serviceGroupSchema.pick({ id: true }),
    body: serviceGroupSchema.omit({ id: true }).partial()
})



const serviceSchema = z.object({
    id: z.coerce.number().gte(1),
    descripcion: z.string().min(1).max(50),
    nombre_corto: z.string().min(1).max(20),
    prefijo: z.string().min(1).max(3),
    grupo_id: z.number().gte(3).lte(7),
    grupo: createServiceGroup.pick({body: true}),
    es_seleccionable: z.boolean().optional(),
})

export const createService = z.object({
    body: serviceSchema
        .omit({
            id: true
        }).partial({
            es_seleccionable: true,
            grupo_id: true,
            grupo: true,
        })  
})

export const createServices = z.object({
    body: z.tuple([
        serviceSchema
        .omit({
            id: true
        }).partial({
            es_seleccionable: true,
            grupo: true,
            grupo_id: true
        })
    ])
})

export const updateServices = z.object({
    params: serviceGroupSchema.pick({ id: true }),
    body: serviceSchema.omit({
        id: true,
        grupo: true,
    }).partial()
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

export type createServiceGroupType = z.infer<typeof createServiceGroup>
export type createServicesGroupType = z.infer<typeof createServicesGroup>
export type updateServiceGroupType = z.infer<typeof updateServiceGroup>

export type createServiceType = z.infer<typeof createService>
export type createServicesType = z.infer<typeof createServices>
export type updateServicesType = z.infer<typeof updateServices>