import { z } from 'zod'


const agentTypeSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(1).max(25),
    nombre_corto: z.string().min(1).max(5).regex(
        /^[A-Z]+$/,
        "Letters must be in UPPERCASE"),
    descripcion: z.string().min(1).max(50),
    grupo_servicio_id: z.coerce.number().gte(1),
    estatus: z.coerce.boolean()
})

const agentSchema = z.object({
    id: z.coerce.number().gte(1),
    nombre: z.string().min(1).max(30),
    descripcion: z.string().min(1).max(50),
    tipo_agente_id: z.number().gte(1),
    tipo_agente: agentTypeSchema.omit({ id:true, estatus: true, }),
    departamentos_sucursal_id: z.number().gte(1),
    estatus: z.boolean().optional(),  
    usuario_id: z.number().gte(1).optional()
})

export const createAgent = z.object({  
    body: agentSchema.omit({
        id: true,
        estatus: true,
    }).partial({
        tipo_agente: true,
        tipo_agente_id: true
    })
})

export const updateAgentStatus = z.object({
    params: agentSchema.pick({ id: true }),
    body: agentSchema.omit({
        id: true
    }).partial()
})


export type createAgentType = z.infer<typeof createAgent>
export type updateAgentStatusType = z.infer<typeof updateAgentStatus>