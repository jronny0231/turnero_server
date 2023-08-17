import { z } from 'zod'

export const createServices = z.object({
    body: z.tuple([ z.object({
        descripcion: z.string().min(1).max(50),
        nombre_corto: z.string().min(1).max(20),
        prefijo: z.string().min(1).max(3),
        grupo_id: z.number().gte(3).lte(7),
    })])
})

export const updateServices = z.object({
    params: z.object({
        id: z.number().gte(1)
    }),
    body: z.object({
        descripcion: z.string().min(1).max(50).optional(),
        nombre_corto: z.string().min(1).max(20).optional(),
        prefijo: z.string().min(1).max(3).optional(),
        grupo_id: z.number().gte(3).lte(7).optional(),
    })
})

export type createServicesType = z.infer<typeof createServices>["body"]
export type updateServicesType = z.infer<typeof updateServices>