import { Request, Response } from 'express';
import { Servicios, Turnos } from '@prisma/client';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';

import * as queueModel from '../models/queue.model';
import * as serviceModel from '../models/service.model';
import { TurnoYCliente } from '../types/queue';

/*
    id: number;
    secuencia_ticket: string;
    servicio_actual_id: number;
    servicio_destino_id: number;
    estado_turno_id: number;
    cola_posicion: number;
    cliente_id: number;
    sucursal_id: number;
    registrado_por_id: number;
    createdAt: Date;
    */

const INPUT_TYPES_TURNOS: string[] = ['tipo_identificacion_id','identificacion','es_tutor','servicio_destino_id'];
const OUTPUT_TYPES_TURNOS: string[] = ['id','secuencia_ticket','servicio_destino','servicio_actual','cola_posicion','cliente','createdAt','updateAt'];

export const GetAllQueues = ((_req: Request, res: Response) => {
    queueModel.GetAll().then((queues => {
       
        const data = queues.map((queue) => {
            return <Servicios> ObjectFiltering(queue, OUTPUT_TYPES_TURNOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

export const GetQueueById = ((_req: Request, res: Response) => {
    res.send('Get Turno by ID');
})

/**
 * Funcion principal que registra un nuevo turno en el sistema...
 * incluyendo los datos por defecto del cliente nuevo o enlazando si existe
 * procesando todos los datos por los parametros automaticos
 */
export const StoreNewQueue = ( async (req: Request, res: Response) => {
    const reqData: any = req.body;

    if(ObjectDifferences(reqData, INPUT_TYPES_TURNOS).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', received: reqData, valid: INPUT_TYPES_TURNOS})
    }

    // Nombre del tutorado predefinido cuando es valido
    const defaultTutorado: string = 'sin definir'
    
    // Optiene la fecha actual
    const nowTimestamp: Date = new Date(Date.now());
    const nowDate: Date = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate())

    // Optiene el id del usuario logeado que emitio el turno
    const userId: number = res.locals.payload.id;
    
    // Optiene la sucursal a la que pertenece el agente del usuario logueado
    const officeId: number = 1;

    // Obtiene el estado de turno predeterminado para el nuevo turno
    const queueStateId: number = 1;

    // Obtiene el id del servicio siguiente con prioridad en la tabla 'servicios_dependientes' (casos generales: Registro)
    const nextServiceId: number = 1;

    // Obtiene el objeto Servicio segun el id de la request
    const serviceRequest: Servicios = await serviceModel.GetById(reqData.servicio_destino_id);
    
    // Obtiene la cantidad de turnos en la cola del servicio siguiente y le suma 1 para setear la cola
    const lastQueuesInServiceToday: number = (await queueModel.GetsBy({servicio_destino_id:reqData.servicio_destino_id, sucursal_id: officeId, fecha_turno: nowDate })).length + 1
    
    // Setea el codigo de Ticket para el nuevo turno
    const queueSecuency: string = serviceRequest.prefijo + lastQueuesInServiceToday;

    const queueData: TurnoYCliente = {
        secuencia_ticket: queueSecuency,
        servicio_actual_id: nextServiceId,
        servicio_destino_id: Number(reqData.servicio_destino_id),
        estado_turno_id: queueStateId,
        cola_posicion: lastQueuesInServiceToday,
        registrado_por_id: userId,
        sucursal_id: officeId,
        fecha_turno: nowDate,
        cliente: {
            tipo_identificacion_id: reqData.tipo_identificacion_id,
            identificacion: reqData.identificacion,
            nombre_tutorado: reqData.es_tutor ? defaultTutorado : null,
            registrado_por_id: userId,
        }
    }
    try{
        const newQueue: Turnos = await queueModel.StoreWithClient(queueData)
        const data = <Turnos> ObjectFiltering(newQueue, OUTPUT_TYPES_TURNOS);
        
        return res.send({message: 'Queue created successfully!', data});
    
    } catch(error: any){
        if(error.code === 'P2000')
            return res.status(400).send({error: 'A field is too longer.', message: error.message});
        
        return res.status(400).send({error: error.message});
    }
})

export const UpdateQueue = ((_req: Request, res: Response) => {
    res.send('Update a Turno');
})

export const DeleteQueue = ((_req: Request, res: Response) => {
    res.send('Delete a Turno');
})