import { z } from 'zod'
import { createUser } from './user.schema'

export const createAgent = z.object({  
    body: z.object({
        nombre: z.string().min(1).max(30),
        descripcion: z.string().min(1).max(50),
        grupo_servicio_id: z.number().gte(1).lte(23),
        tipo_agente_id: z.number().gte(1).lte(5),
        departamento_sucursal_id: z.number().gte(1),
        usuario_id: z.number().gte(1),
        estatus: z.boolean().optional(),
        usuario: createUser.pick( {body: true} ).optional()
    })   
})

export const updateAgentStatus = z.object({
    body: z.object({
        esperando: z.boolean(),
        servicios_destino_id: z.tuple([ z.number().gte(1).lte(23) ]),
    })
})


export type createAgentType = z.infer<typeof createAgent>
export type updateAgentStatusType = z.infer<typeof updateAgentStatus>