import { Servicios, Turnos, Clientes, Departamentos, Agentes, turno_llamada } from "@prisma/client"
import { UsuarioTypes } from "./user"

export interface ExportableQueuesType extends Turnos {
    servicio_actual:    Servicios     
}

export interface TurnoYCliente extends Omit<Turnos, 'id' | 'cliente_id' | 'createdAt'> {
    
    cliente: Omit<Clientes, 'id' | 'nombre' | 'apellidos' | 'seguro_id' | 'modificado_por_id' |
                            'fecha_ultima_visita' | 'estatus' | 'createdAt' | 'updatedAt'>,
}

export type Ticket = {
    id: number,
    sucursal: number,
    secuencia_ticket: string,
    servicio_destino: string,
    createdAt: Date,
}

export interface SucursalTurnos extends Turnos {
    departamento?: Partial<Departamentos> | null
  }

export interface PantallaTurnos extends Partial<Turnos> {
    servicio_destino?: Partial<Servicios>
    atenciones_turnos_servicios: {
        agente: { 
            nombre: string;
            departamento_sucursal: {
                departamento: {
                    descripcion: string;
                    siglas: string;
                }
            }
        }
    } []
}

export type DisplayQueue = {
    id: number,
    tittle: string,
    callStatus: turno_llamada
    message: {
        servicio: string
        departamento: string
    }
};

export type attendingState = {
    agente_id: number,
    servicio_id: number,
    turno_id: number,
    estado_turno_id: number,
    razon_cancelado_id?: number
}