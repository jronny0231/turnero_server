import { z } from 'zod'

export const agentSchema = z.object({
    nombre: z.string().min(1).max(30),
    descripcion: z.string().min(1).max(50),
    tipo_agente_id: z.number().gte(1),
    departamentos_sucursal_id: z.number().gte(1),
    estatus: z.boolean().optional(),  
    usuario_id: z.number().gte(1).optional()
})

export const createAgent = z.object({  
    body: agentSchema  
})

export const updateAgentStatus = z.object({
    body: z.object({
        esperando: z.boolean(),
        agente_id: z.number().gte(1),
        servicios_destino_id: z.tuple([ z.number().gte(1).lte(23) ]),
    })
})


export type createAgentType = z.infer<typeof createAgent>
export type updateAgentStatusType = z.infer<typeof updateAgentStatus>