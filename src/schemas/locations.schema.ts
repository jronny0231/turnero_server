import { z } from 'zod';

const locationSchema = z.object({
    id: z.coerce.number().gte(1),
    calle: z.string().min(5).max(50),
    numero: z.coerce.number().min(1),
    piso: z.coerce.number().min(1),
    sector: z.string().min(5).max(50),
    estado_provincia: z.string().min(5).max(30),
    latitud_decimal: z.string().min(10).max(20),
    longitud_decimal: z.string().min(10).max(20),
})

export const createLocation = z.object({
    params: locationSchema.pick({}),
    query: locationSchema.pick({}),
    body: locationSchema.omit({
        id: true
    }).partial({
        latitud_decimal: true,
        longitud_decimal: true
    })
})

export type createLocationType = z.infer<typeof createLocation>