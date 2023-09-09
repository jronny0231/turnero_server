import { Request, Response } from 'express';
import { Clientes, PrismaClient } from '@prisma/client';
import { createClientType, updateClientType } from '../schemas/client.schema';

const prisma = new PrismaClient();

export const GetAllClients = async (_req: Request, res: Response) => {
    try {
        const clientes: Clientes[] = await prisma.clientes.findMany().finally(async () => await prisma.$disconnect())
        
        if (clientes.length === 0) return res.status(404).json({message: 'Clients data was not found'})
        
        return res.json({success: true, message: 'Clients data was successfully recovery', data: clientes})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Clients data.', data: error})
    }
}


export const GetClientsById = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const cliente = await prisma.clientes.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (cliente === null) return res.status(404).json({message: `Client data with id: ${id} was not found`})
        
        return res.json({success: true, message: `Client with id: ${id} was successfully recovery`, data: cliente})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Clients data.', data: error})
    }
}

export const StoreNewClient = async (req: Request, res: Response) => {
    const data: createClientType['body'] = req.body
    const registrado_por_id: number = res.locals.payload.id; 

    try {
        let seguro_id: number | undefined = data.seguro_id;
        await prisma.$connect()

        if (seguro_id === undefined) {

            if (data.seguro === undefined) {
                return res.status(400).json({success:false, message: "Seguro or seguro_id not receive"})
            }
            
            let seguro = await prisma.seguros.findFirst({
                where: { OR: [
                        { siglas: data.seguro.siglas },
                        { nombre_corto: data.seguro.nombre_corto },
                        { nombre: data.seguro.nombre }
                    ]
                }
            })
            if (seguro === null) {
                seguro = await prisma.seguros.create({
                    data: { ...data.seguro }
                })
            }
            seguro_id = seguro.id
        }

        const nuevoCliente = await prisma.clientes.create({
            data: {
                ...data,
                seguro: undefined,
                seguro_id,
                registrado_por_id
            }
        })

        return res.json({success: true, message: 'Cliente data was successfully created', data: nuevoCliente})
    
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Cliente.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateClient = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as updateClientType['params']
    const data: updateClientType['body'] = req.body

    try {
        const result = await prisma.clientes.update({
            where: { id },
            data: {
                ...data,
            }
        })

        return res.json({sucess: true, message: `Cliente id: ${id} was successfully updated`, data: result})
    
    } catch (error) {
        return res.status(500).json({message: `Server status error updateing Cliente id ${id}`, data: error})
    
    } finally {
        await prisma.$disconnect()
    }

}

export const DeleteClient = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.clientes.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Cliente was deleted successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Cliente id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Cliente id: ${id}`, data: error});
    }
}