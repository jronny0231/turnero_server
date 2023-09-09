import { z } from 'zod';


const typeReferSchema = z.object({
    id: z.coerce.number().gte(0),
    nombre: z.string().min(3).max(10),
    descripcion: z.string().min(3).max(50),
})

const referSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(3).max(10),
    referencia: z.string().min(3).max(30),
    tipo: typeReferSchema,
    tipo_id: z.coerce.number().gte(1),
    descripcion: z.string().min(3).max(100),
    localidad: z.string().min(3).max(50),
    sector: z.string().min(3).max(50),
    estado_provincia: z.string().min(3).max(30),
})

export const createRefer = z.object({
    body: referSchema.omit({
        id: true,
    }).partial({
        tipo: true
    })
})

export type createReferType = z.infer<typeof createRefer>