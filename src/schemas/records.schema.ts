import { z } from 'zod'

export const recordSchema = z.object({
    uuid: z.string().uuid(),
    secuencia_ticket: z.string().length(5).regex(
        /^([A-Z]{3})(\d{2})+$/,
        "Must be a sequency of 3 UPPERCASE letters and 2 digits (incl. zero)"),
    servicio: z.string().length(3),
    departamento: z.string(),
})

export const setQueueCallAudio = z.object({
    body: recordSchema.partial({
        servicio: true,
    })
})

export const getQueueCallAudio = z.object({
    params: recordSchema.pick({ uuid: true }),
})

export type getQueueCallAudioType = z.infer<typeof getQueueCallAudio>
export type setQueueCallAudioType = z.infer<typeof setQueueCallAudio>