import { z } from 'zod'

export const recordSchema = z.object({

})

export const getQueueCallAudio = z.object({
    params: z.object({

    }),

    query: z.object({
        number: z.coerce.number().gte(1).lte(99),
        letters: z.string().min(3).max(3)
                        .regex(/^[A-Z]+$/,
                        "Letters must be in UPPERCASE"),
        department: z.coerce.string().max(5)
                        .regex(/^[A-Z0-9]+$/,
                        "Department abrev must be in UPPERCASE and optional a number"),
        service: z.coerce.string().max(3)
                        .regex(/^[A-Z]+$/,
                        "Service abrev must be in UPPERCASE").optional(),
    }),

    body: z.object({

    })
})

export type getQueueCallAudioType = z.infer<typeof getQueueCallAudio>