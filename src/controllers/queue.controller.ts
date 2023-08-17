import { Request, Response } from 'express';
import { PrismaClient, Turnos, turno_llamada } from '@prisma/client';
import { UUID } from 'crypto';
import { getAttendingQueueByUserId, addNewQueueState, getActiveQueueList, getCallQueueState, getQueuesListBySucursalId, getServiceById, setAttendingState, setCallQueueState } from '../core/global.state';
import { getUnrelatedFirstService } from '../core/flow.manage';
import { newQueueWithClientType, updateQueueStateType } from '../schemas/queue.schema';



const prisma = new PrismaClient();


export const GetAllQueues = async (_req: Request, res: Response) => {
    try {
        const turnos = await prisma.turnos.findMany().finally(async () => await prisma.$disconnect())
        
        if (turnos.length === 0) return res.status(404).json({message: 'Turnos data was not found'})
        
        return res.json({success: true, message: 'Turnos data was successfully recovery', data: turnos})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Turnos data.', data: error})
    }
}

export const GetQueueById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = await prisma.turnos.findFirst({
            where: { id}
        }).finally( async () => await prisma.$disconnect() )

        if (result === null)
            return res.status(404).json({success: false, message: `No Turno was found with id: ${id}`})

        return res.json({success: true, message: 'Turno data was successfully recovery', data: result})

    } catch (error) {
        return res.status(500).json({success: false, message: 'Server status error finding Turno data.', data: error})
    }
}

export const getNewCallingsByDisplayId = (_req: Request, res: Response) => {
    const key: UUID = res.locals.display
    
    const data = getCallQueueState({displayUUID: key})

    if (data === null) {
        return res.status(404).json({success: false, message: 'No Turnos pending to call found', data})    
    }
    return res.json({success: true, message: 'Turno calling data successfully getted ', data})
}

export const updateCallingsByDisplayId = (req: Request, res: Response) => {
    const displayUUID: UUID = res.locals.display
    const {estatus}: {estatus: turno_llamada } = req.body;
    const state_id = Number(req.params.id);

    const result = setCallQueueState({state_id, displayUUID, estatus})

    return res.json({success: true, data: result})
}

export const getActiveQueuesByDisplayId = (_req: Request, res: Response) => {
    
    try {
        const displayUUID: UUID = res.locals.display
        const turnos = getActiveQueueList({displayUUID})

        if (turnos === null)
            return res.status(404).json({success: false, message: 'No active Turnos to display', data: turnos}) 

        const data = turnos.map((turno) => {
            return {
                id: turno.id,
                secuencia_ticket: turno.secuencia_ticket,
                servicio_destino: turno.activo.servicio_name,
                agente: turno.activo.agente_name,
                destino: turno.activo.servicio_name
            }
        })

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
        return res.json({success: true, data: {columns, data}});

    } catch (error) {
        return res.status(500).json({success: false, message: 'Server status error finding active Turnos.', data: error})
    }
}

export const getActiveQueuesByClientId = async (req: Request, res: Response) => {
    const cliente_id = Number(req.params.id)

    try {
        const turnos = await prisma.turnos.findMany({
            where: { cliente_id }
        }).finally( async () => await prisma.$disconnect() )

        if (turnos === null) 
            return res.status(404).json({success: false, message: 'No active Turnos to display', data: null}) 

        return res.json({success: true, message: `Turnos by cliente_id: ${cliente_id} successfully getted`, data: turnos})

    } catch (error) {
        return res.status(500).json({success: false, message: `Server status error finding all Turnos by cliente_id: ${cliente_id}`, data: error})
    }
}

/**
 * Funcion principal que registra un nuevo turno en el sistema...
 * incluyendo los datos por defecto del cliente nuevo o enlazando si existe
 * procesando todos los datos por los parametros automaticos
 */
export const StoreNewQueue = (req: Request, res: Response) => {
    const body: newQueueWithClientType = req.body;

    /**  Syncronous operations, perform response waiting for  **/
    try {
        
        const nowTimestamp: Date = new Date(Date.now()); // Otiene la fecha actual
        //const nowDate: Date = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate())

        // Obtiene el id del usuario logeado que emitio el turno
        const registrado_por_id: number = res.locals.payload.id; 
        
        // Cantidad de ceros en la secuencia del ticket
        const cantPosMark: number = 2; 

        const servicio_destino = getServiceById(body.servicio_destino_id)
        if (servicio_destino === null) return res.status(404).json({success:false, message: 'Could not found servicio requested to turno'})

        const cola_posicion = getQueuesListBySucursalId(body.sucursal_id).length + 1
        
        const secuencia_ticket: string = servicio_destino.prefijo + ('0' + cola_posicion).slice(cantPosMark * -1);

        const response = {
            secuencia_ticket,
            servicio_destino: servicio_destino.descripcion,
            createdAt: nowTimestamp.toLocaleString()
        }

        new Promise( async (resolve, reject) => {
            try {
                await prisma.$connect()

                const cliente = async () => {
                    const clienteFound = await prisma.clientes.findFirst({
                        where: {  identificacion: body.cliente.identificacion  }
                    })
                    if (clienteFound) return clienteFound

                    return await prisma.clientes.create({
                        data: {
                            ...body.cliente,
                            registrado_por_id,
                            nombre_tutorado: (body.cliente.es_tutor ? 'sin_definir' : undefined)
                        }
                    })
                }

                const servicio_actual_id = await getUnrelatedFirstService({
                    seguro_id: (await cliente()).seguro_id ?? 0,
                    sucursal_id: body.sucursal_id,
                    servicio_destino_id: servicio_destino.id
                })

                const turno = await prisma.turnos.create({
                    data: {
                        secuencia_ticket,
                        cliente_id: (await cliente()).id,
                        servicio_actual_id,
                        servicio_destino_id: servicio_destino.id,
                        cola_posicion,
                        registrado_por_id,
                        sucursal_id: body.sucursal_id,
                        fecha_turno: nowTimestamp.toLocaleDateString()
                    }
                })

                addNewQueueState({turno})

                resolve(turno)

            } catch (error: any) {
                console.error("Error when create new Turno in Promise clousure", {error})
                
                if(error.code === 'P2000')
                console.error({success: false, error: 'A field is too longer.', message: error.message});
                
                return reject(error)
            }

        }).then(console.log)
        .finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Turno was created successfully!", data: response})

    } catch (error) {
        console.error(`Error trying to create a new turno sync on ${Date.now().toLocaleString()}`, {error})
        return res.status(500).json({success: false, message: `Error trying to create a new turno sync on ${Date.now().toLocaleString()}`, data: error})
    }
}

export const GetToAttendQueue = ( res: Response) => {
    const usuario_id: number = res.locals.payload.id;

    try {
        const turno = getAttendingQueueByUserId({usuario_id})

        if (turno === null)
            return res.status(404).json({success: false, message: 'No active Turnos to display', data: null}) 

        return res.json({success: true, message: 'Active Turno was found', data: turno})

    } catch (error) {
        console.error(`Error trying to get current attending Turno with user_id: ${usuario_id}`, {error})
        return res.status(500).json({success: false, message: `Error trying to get current attending Turno with user_id: ${usuario_id}`, data: error})
    }

}

export const UpdateStateQueue = async (req: Request, res: Response) => {
    const body: updateQueueStateType['body'] = req.body;
    const {id: turno_id} = req.params as unknown as updateQueueStateType['params']
    
    try {
        if (body.servicio_id === undefined || body.agente_id === undefined || body.estado_turno_id === undefined){
            return res.status(404).json({success: false, message: "Data receive is incomplet or bad formed"})
        }

        const isUpdate = await setAttendingState({...body, turno_id})

        if (isUpdate) return res.json({success: true, message:"Turno status was updated successfully!", data: isUpdate})

        return res.status(404).json({success: false, message:"Turno status could not updated", data: isUpdate})
        
    } catch (error) {
        console.error(`Error trying update Status Turno id: ${turno_id} with status_turno_id: ${body.estado_turno_id}`, {error}) 

        return res.status(500).json({success: false, message: `Error trying update Status Turno id: ${turno_id} with status_turno_id: ${body.estado_turno_id}`, data: error})
    }
}

export const UpdateQueue = async (req: Request, res: Response) => {
    const body: Partial<Turnos> = req.body;
    const id = Number(req.params.id)

    try {
        await prisma.$connect()

        const result = await prisma.turnos.update({
            where: { id },
            data: {
                ...body
            }
        }). finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Turno was update successfully!", data: result})
        
    } catch (error: any) {
        console.error(`Error trying update Turno id: ${id}`, {error}) 
        if(error.code === 'P2000')
            return res.status(400).json({success: false, error: 'A field is too longer.', message: error.message});

        return res.status(500).json({success: false, message: `Error trying update Turno id: ${id}`, data: error})
    }
}

export const DeleteQueue = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.turnos.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Turno was update successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Turno id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Turno id: ${id}`, data: error});
    }

}

/*
const validateNewTurno = (data: NuevoTurnoType) => {
    return z.object({
        servicio_destino_id: z.number().gte(1).lte(23),
        sucursal_id: z.number().gte(1).lte(3),
        cliente: z.object({
            tipo_identificacion_id: z.number().gte(1).lte(3),
            identificacion: z.string()
            .min(
                data.cliente.tipo_identificacion_id === 1 ? 11
                : data.cliente.tipo_identificacion_id === 2 ? 9
                    : data.cliente.tipo_identificacion_id === 3 ? 10 : 0)
            .max(
                data.cliente.tipo_identificacion_id === 1 ? 13
                : data.cliente.tipo_identificacion_id === 2 ? 11
                    : data.cliente.tipo_identificacion_id === 3 ? 20 : 0
            ),
            seguro_id: z.number().gte(1).lte(2),
            es_tutor: z.boolean(),
        })
    }).parse(data)
}
*/