import { Agentes, Clientes, Departamentos, Departamentos_sucursales, Sucursales, Tipos_agentes } from '@prisma/client'

export interface AgentWithUser extends Agentes {
    usuario: {
        nombres: string
        correo: string
        username: string
        password: string
        rol_id: number
    }
}

export interface AuthedAgent extends Agentes {
    tipo_agente: Tipos_agentes
    departamento_sucursal: DepartmentOffice
}

export interface DepartmentOffice extends Pick<Departamentos_sucursales, 'estatus'> {
    departamento: Pick<Departamentos, 'id' | 'descripcion'>
    sucursal: Pick<Sucursales, 'id' | 'descripcion'>
}

export interface SuperAgent extends Pick<Agentes, 'nombre' | 'id'> {
    tipo_agente: Pick<Tipos_agentes, 'nombre'>
    departamento_sucursales: {
        departamento: Pick<Departamentos, 'descripcion'>
        sucursal: Pick<Sucursales, 'descripcion'>
    }
}