import { z } from 'zod'

export const recordSchema = z.object({

})

export const getQueueCallAudio = z.object({
    params: z.object({
        uuid: z.string().uuid()
    })
})

export type getQueueCallAudioType = z.infer<typeof getQueueCallAudio>