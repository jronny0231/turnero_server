import { Request, Response } from 'express';
import { Clientes, PrismaClient } from '@prisma/client';
import { ClientWithSeguro } from '../@types/agent';

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

type typeWith = 'SEGURO' | 'NONE'



export const StoreNewClient = async (req: Request, res: Response) => {
    const receive = req.query.with ?? false
    const include: typeWith = receive ? String(receive).toUpperCase() as typeWith : 'NONE'

    const registrado_por_id: number = res.locals.payload.id; 

    try {
        let nuevoCliente: any = {} 
        await prisma.$connect()

        if (include === 'SEGURO') {
            const data: ClientWithSeguro = req.body
            let seguro = await prisma.seguros.findFirst({
                where: { NOT: { OR: [
                        { siglas: data.seguro.siglas },
                        { nombre_corto: data.seguro.nombre_corto },
                        { nombre: data.seguro.nombre }
                    ]
                }}
            })
            if (seguro === null) {
                seguro = await prisma.seguros.create({
                    data: { ...data.seguro }
                })
            }

            nuevoCliente = await prisma.clientes.create({
                data: {
                    ...data,
                    seguro: undefined,
                    seguro_id: seguro.id,
                    registrado_por_id
                }
            })
        } else if (include === 'NONE') {

        }

        if (nuevoCliente === null) return res.status(404).json({message: 'Cliente was not created'})

        return res.json({success: true, message: 'Cliente data was successfully created', data: nuevoCliente})
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Cliente.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateClients = ((_req: Request, res: Response) => {
    res.send('Update a Clientes');
})

export const DeleteClients = ((_req: Request, res: Response) => {
    res.send('Delete a Clientes');
})