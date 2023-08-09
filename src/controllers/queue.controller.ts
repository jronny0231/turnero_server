import { Request, Response } from 'express';
import { Servicios, Servicios_dependientes, Turnos } from '@prisma/client';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';

import * as queueModel from '../models/queue.model';
import * as agentModel from '../models/agent.model';
import { GetAllDependentsBySelectableId as Dependents } from '../models/service.model'; 
import { CallStatus, DisplayQueue, PantallaTurnos, Ticket, TurnoYCliente } from '../@types/queue';
import { UUID } from 'crypto';

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

    const calledQueue: DisplayQueue = {
        id: 3,
        tittle: "TURNO " + "ORO03",
        callStatus: 'UNCALLED',
        message: {
            servicio: "Reriro de Orden",
            departamento: "Optica"
        },
        voice: {
            lenght: 3,
            // url: ""
        }
    }

const INPUT_TYPES_TURNOS: string[] = [
    'tipo_identificacion_id',
    'identificacion',
    'es_tutor',
    'servicio_destino_id',
    'servicio_destino',
    'servicio_prefijo',
    'cola_posicion',
    'sucursal_id', ];

const OUTPUT_TYPES_TURNOS: string[] = [
    'id',
    'secuencia_ticket',
    'servicio_destino',
    'servicio_actual',
    'estado_turno',
    'cola_posicion',
    'cliente',
    'createdAt',
    'updateAt' ];

export const GetAllQueues = (_req: Request, res: Response) => {
    queueModel.GetAll().then((queues => {
       
        const data = queues.map((queue) => {
            return <Servicios> ObjectFiltering(queue, OUTPUT_TYPES_TURNOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
}

export const GetQueueById = (_req: Request, res: Response) => {
    res.send('Get Turno by ID');
}

export const setNewCallingsByDisplayId = async (_req: Request, res: Response) => {
    const userId: number = Number(res.locals.payload.id)
    const agent = await agentModel.GetByUserId(userId);
    
    if(!agent) return res.status(404).send({error: 'Agent assigned to any user, please check configuration'});
    


    return res.send({success: true, display: userId, data: {}})
}

/**
 * Returns one calling queue at time to request display by sucursal
 * @param _req 
 * @param res 
 * @returns response json object as DisplayQueue type
 */
export const getNewCallingsByDisplayId = (_req: Request, res: Response) => {
    const key: UUID = res.locals.display
    
    return res.send({success: true, display: key, data: calledQueue})
    
}

export const updateCallingsByDisplayId = (req: Request, res: Response) => {
    const key: UUID = res.locals.display
    const data: {status: CallStatus
    } = req.body;
    const queueId: number = Number(req.params.id);

    calledQueue.callStatus = data.status

    console.log({calledQueue, queueId, data})

    return res.send({success: true, display: key})
}


/**
 * Function to get a list of queues that are currently open for processing
 * @param _req
 * @param _res
 * @returns {Promise<{}>}
 */
export const getActiveQueuesByDisplayId = async (_req: Request, res: Response): Promise<{}> => {
    
    const key: UUID = res.locals.display

    const nowTimestamp: Date = new Date(Date.now()); // Otiene la fecha actual
    const nowDate: Date = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate())
    const dateFiltering = {
        lte: nowDate,
        gte: nowDate,
    }
    
    const queues: PantallaTurnos[] = await queueModel.GetsByWithDisplayKey({
        key,
        where: {fecha_turno: dateFiltering},
        match:{param: 'estado_turno', field:'descripcion', values: ['ESPERANDO','ATENDIENDO','EN_ESPERA']}
    });

    let data: object[] = [{
        id: 1,
        secuencia_ticket: "CPV01",
        servicio_destino: "Consulta Post Quirurgica",
        agente: "Dr. Escaño ",
        destino: "Consultorio 1",
    },
    {
        id: 2,
        secuencia_ticket: "CPV02",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 3,
        secuencia_ticket: "CPV03",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 4,
        secuencia_ticket: "CPV04",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 5,
        secuencia_ticket: "CPV05",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 6,
        secuencia_ticket: "CSE01",
        servicio_destino: "Consulta de Seguimiento",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 7,
        secuencia_ticket: "CPV06",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 8,
        secuencia_ticket: "CPV07",
        servicio_destino: "Consulta Oftalmologica",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 9,
        secuencia_ticket: "CSE02",
        servicio_destino: "Consulta de Seguimiento",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    },
    {
        id: 10,
        secuencia_ticket: "CSE03",
        servicio_destino: "Consulta de Seguimiento",
        agente: "Dr. Escaño",
        destino: "Consultorio 1",
    }]
    if (queues.length > 0) {
        data = queues.map((queue) => {
            return {
                id: queue.id,
                secuencia_ticket: queue.secuencia_ticket,
                servicio_destino: queue.servicio_destino?.descripcion,
                agente: queue.atenciones_turnos_servicios[0]?.agente?.nombre ?? "",
                destino: queue.atenciones_turnos_servicios[0]?.agente?.departamento_sucursal?.departamento?.descripcion ?? ""
            }
        })
    }
    const columns = [
        {
            name: "secuencia_ticket",
            label: "TURNO",
            widthPercent: 0.2,
            isBold: true,
        },{
            name: "agente",
            label: "AGENTE",
            widthPercent: 0.3,
            isBold: false,
        },{
            name: "servicio_destino",
            label: "SERVICIO",
            widthPercent: 0.5,
            isBold: false,
        }
    ]
    return res.send({success: true, data: {columns, data}});
}

export const getActiveQueuesByClientId = async (req: Request, res: Response): Promise<{}> => {
    const cliente_id = Number(req.params.id)

    const queues: Turnos[] = await queueModel.GetsByWithDepartamento(
            {cliente_id},
            {param: 'estado_turno', field:'descripcion', values: ['ESPERANDO','ATENDIENDO','EN_ESPERA']}
    );

    if(queues.length === 0) {
        return res.status(404).send({error: 'No se encontraron turnos activos'});
    }

    const data = queues.map((queue) => {
        return <Turnos> ObjectFiltering( queue, [
            'id', 'secuencia_ticket', 'servicio_destino', 'departamento', 'estado_turno'
        ]);
    })
    
    return res.send({success: true, data});
}

/**
 * Funcion principal que registra un nuevo turno en el sistema...
 * incluyendo los datos por defecto del cliente nuevo o enlazando si existe
 * procesando todos los datos por los parametros automaticos
 */
export const StoreNewQueue = async (req: Request, res: Response) => {
    const reqData: any = req.body;

    if(ObjectDifferences(reqData, INPUT_TYPES_TURNOS).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', received: reqData, valid: INPUT_TYPES_TURNOS})
    }

    /**  Syncronous operations, perform response waiting for  **/

    const defaultTutorado: string = 'sin definir' // Nombre del tutorado predefinido cuando es valido
    const defaultNextService: number = 17 // id del siguiente servicio por default (Registro)
    
    const nowTimestamp: Date = new Date(Date.now()); // Otiene la fecha actual
    const nowDate: Date = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate())

    const userId: number = res.locals.payload.id; // Obtiene el id del usuario logeado que emitio el turno
    const officeId: number = reqData.sucursal_id;     // Otiene la sucursal a la que pertenece el agente del usuario logueado
    const queueStateId: number = 1; // Obtiene el estado de turno predeterminado para el nuevo turno
    
    // Setea el codigo de Ticket para el nuevo turno
    const cantPosMark: number = 2; // Cantidad de ceros en la secuencia del ticket
    const queueSecuency: string = reqData.servicio_prefijo + ('0' + reqData.cola_posicion).slice(cantPosMark * -1);

    const queueData: TurnoYCliente = {
        secuencia_ticket: queueSecuency,
        servicio_actual_id: defaultNextService,
        servicio_destino_id: Number(reqData.servicio_destino_id),
        estado_turno_id: queueStateId,
        cola_posicion:  Number(reqData.cola_posicion),
        registrado_por_id: userId,
        sucursal_id: officeId,
        fecha_turno: nowDate,
        cliente: {
            tipo_identificacion_id: Number(reqData.tipo_identificacion_id),
            identificacion: reqData.identificacion,
            nombre_tutorado: reqData.es_tutor ? defaultTutorado : null,
            registrado_por_id: userId,
        }
    }

    try{
        const newQueue: Turnos = await queueModel.StoreWithClient(queueData)
        
        /**  Asyncronous operations, perform background  **/

        new Promise(async (resolve, reject) => {
            // Asyncronous operations...

            // Obtiene el id del servicio siguiente con la prioridad mas alta en la tabla 'servicios_dependientes' (casos generales: Registro)
            const nextService: Servicios_dependientes = (await Dependents(reqData.servicio_destino_id))[0]
            const servicio_destino_id: number = nextService ? nextService.servicio_dependiente_id : 17 // 17 Servicio: Registro
            
            const result: Turnos|null = await queueModel.Update(newQueue.id, {servicio_destino_id})
                        .catch((err: any) => {
                            reject(err)
                            return null
                        })

            resolve(result)
            
        })

        const data: Ticket = {
            id: newQueue.id,
            sucursal: reqData.sucursal,
            secuencia_ticket: queueSecuency,
            servicio_destino: reqData.servicio_destino,
            createdAt: newQueue.createdAt ?? nowTimestamp,
        };

        return res.json({message: 'Queue created successfully!', data});
    
    } catch(error: any){
        if(error.code === 'P2000')
            return res.status(400).send({error: 'A field is too longer.', message: error.message});
        
        return res.status(400).send({error: error.message});
    }
}

export const UpdateQueue = (_req: Request, res: Response) => {
    res.send('Update a Turno');
}

export const DeleteQueue = (_req: Request, res: Response) => {
    res.send('Delete a Turno');
}