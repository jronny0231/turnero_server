import { Servicios, Turnos, Clientes } from "@prisma/client"
import { UsuarioTypes } from "./user"

export interface ExportableQueuesType extends Turnos {
    servicio_actual:    Servicios     
}

export interface TurnoYCliente extends Omit<Turnos, 'id' | 'cliente_id' | 'createdAt'> {
    
    cliente: Omit<Clientes, 'id' | 'nombre' | 'apellidos' | 'seguro_id' | 'modificado_por_id' |
                            'fecha_ultima_visita' | 'estatus' | 'createdAt' | 'updatedAt'>,
}
