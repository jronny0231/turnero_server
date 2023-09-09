import { Request, Response } from 'express';
import { PrismaClient, Visitas_agendadas } from '@prisma/client';
import { createScheduleType, updateScheduleType } from '../schemas/schedule.schema';

const prisma = new PrismaClient();

export const GetAllSchedules = async (_req: Request, res: Response) => {
    try {
        const schedules: Visitas_agendadas[] = await prisma.visitas_agendadas.findMany().finally(async () => await prisma.$disconnect())
        
        if (schedules.length === 0) return res.status(404).json({message: 'Schedules data was not found'})
        
        return res.json({success: true, message: 'Schedules data was successfully recovery', data: schedules})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Schedules data.', data: error})
    }
}


export const GetSchedulesById = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const schedule = await prisma.visitas_agendadas.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (schedule === null) return res.status(404).json({message: `Schedule data with id: ${id} was not found`})
        
        return res.json({success: true, message: `Schedule with id: ${id} was successfully recovery`, data: schedule})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Schedules data.', data: error})
    }
}

export const StoreNewSchedule = async (req: Request, res: Response) => {
    const data: createScheduleType['body'] = req.body
    const registrado_por_id: number = res.locals.payload.id; 

    try {
        let tipo_visita_id: number = data.tipo_visita_id ?? 0
        let clientes_id: {id: number}[] = [{id: data.cliente_id ?? 0}]

        await prisma.$connect()

        if (data.clientes !== undefined) {
            const clients = await prisma.$transaction([
                ...data.clientes.map(cliente => {
                    return prisma.clientes.upsert({
                        where: {
                            identificacion: cliente.body.identificacion,
                            tipo_identificacion_id: cliente.body.tipo_identificacion_id,
                        },
                        update: {
                            ...cliente,
                            tipo_identificacion: undefined
                        },
                        create: {
                            ...cliente.body,
                            seguro: undefined,
                            tipo_identificacion: undefined,
                            registrado_por_id,
                        },
                        select: {
                            id: true
                        }
                    })
                })
            ])

            clientes_id = clients
        }

        if (tipo_visita_id === 0) {
            if (data.tipo_visita === undefined) {
                return res.status(400).json({success: false, messsage: "Tipo_visita or tipo_visita_id not received"})
            }

            let tipo_visita = await prisma.tipos_visitas.findFirst({
                where: {
                    nombre: data.tipo_visita.nombre
                }
            })

            if (tipo_visita === null) {
                tipo_visita = await prisma.tipos_visitas.create({
                    data: {
                        ...data.tipo_visita
                    }
                })
            }

            tipo_visita_id = tipo_visita.id

        }
        
        const result = await prisma.$transaction([
            ...clientes_id.map(({id: cliente_id}) => {
                return prisma.visitas_agendadas.create({
                    data: {
                        ...data,
                        cliente_id,
                        tipo_visita: undefined,
                        tipo_visita_id,
                        registrado_por: registrado_por_id
                    }
                })
            })
        ]);



        return res.json({success: true, message: 'Schedule data was successfully created', data: result})
    
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Schedule.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateSchedule = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as updateScheduleType['params']
    const data: updateScheduleType['body'] = req.body

    try {
        const result = await prisma.visitas_agendadas.update({
            where: { id },
            data: {
                ...data,
            }
        })

        return res.json({sucess: true, message: `Schedule id: ${id} was successfully updated`, data: result})
    
    } catch (error) {
        return res.status(500).json({message: `Server status error updateing Schedule id ${id}`, data: error})
    
    } finally {
        await prisma.$disconnect()
    }

}

export const DeleteSchedule = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.visitas_agendadas.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Schedule was deleted successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Schedule id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Schedule id: ${id}`, data: error});
    }
}