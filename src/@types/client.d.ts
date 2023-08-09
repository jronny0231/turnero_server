import { Clientes, Usuarios } from "@prisma/client";

export type ClienteTypes = {
    id:                     number,
    nombre:                 string,
    apellidos:              string,
    tipo_identificacion:    Tipos_identificaciones,
    tipo_identificacion_id: number,
    identificacion:         string,
    seguro:                 Seguros,
    seguro_id:              number,
    nombre_tutorado:        string,
    fecha_ultima_visita:    Date,
    estatus:                boolean,
    registrado_por:         Usuarios,
    registrado_por_id:      number,
    modificado_por_id:      number,
    createdAt:              Date,
    updatedAt:              Date,    
}