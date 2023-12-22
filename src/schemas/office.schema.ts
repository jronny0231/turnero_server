import { z } from 'zod'

const officeSchema = z.object({
    id: z.coerce.number().gte(1),
    descripcion: z.string().min(4).max(30),
    siglas: z.string().max(8)
                .regex(/^[A-Z]+$/,
                    "Must contain only UPPERCASE character."),
    direccion_id: z.number().gte(1),
})

export const createOffice = z.object({
    body: officeSchema
});

export const updateOffice = z.object({
    params: officeSchema.pick({id: true}),

    body: officeSchema.partial()
});


export type createOfficeType = z.infer<typeof createOffice>
export type updateOfficeType = z.infer<typeof updateOffice>
