import { Agentes, Clientes } from '@prisma/client'

export interface AgentWithUser extends Agentes {
    usuario: {
        nombres: string
        correo: string
        username: string
        password: string
        rol_id: number
    }
}