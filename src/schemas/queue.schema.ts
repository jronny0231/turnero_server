import { z } from 'zod'

export const createQueueWithClient = z.object({
    body: z.object({
        servicio_destino_id: z.number().gte(1).lte(23),
        sucursal_id: z.number().gte(1).lte(3),
        cliente: z.object({
            tipo_identificacion_id: z.number().gte(1).lte(3),
            identificacion: z.string().min(9).max(20),
            seguro_id: z.number().gte(1).lte(2),
            es_tutor: z.boolean(),
        })
    })
})

export const updateQueueState = z.object({
    params: z.object({
        id: z.number().gte(1)
    }),

    body: z.object({
        agente_id: z.number().gte(1),
        servicio_id: z.number().gte(1),
        turno_id: z.number().gte(1),
        estado_turno_id: z.number().gte(1).lte(7),
        razon_cancelado_id: z.number().gte(1),
    })
})

export type newQueueWithClientType = z.infer<typeof createQueueWithClient>["body"]
export type updateQueueStateType = z.infer<typeof updateQueueState>