import { Request, Response } from 'express';
import { Agentes, PrismaClient } from '@prisma/client';
import { setWaitingState } from '../core/global.state';
import { createAgentType, updateAgentStatusType } from '../schemas/agent.schema';

const prisma = new PrismaClient;

export const GetAllAgents = async (_req: Request, res: Response) => {
    try {
        const agentes = await prisma.agentes.findMany().finally(async () => await prisma.$disconnect())

        if (agentes.length === 0) return res.status(404).json({message: 'Agentes data was not found'})
        
        return res.json({success: true, message: 'Agentes data was successfully recovery', data: agentes})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Agentes data.', data: error})
    }
}

export const GetAgentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const agente = await prisma.agentes.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())

        if (agente === null) return res.status(404).json({message: `Agente id ${id} data was not found`})
        
        return res.json({success: true, message: `Agente id: ${id} data was successfully recovery`, data: agente})
        
    } catch (error) {
        return res.status(500).json({message: `Server status error getting Agente id: ${id} data.`, data: error})
    }
}

export const StoreNewAgent = async (req: Request, res: Response) => {
    const data: createAgentType['body'] = req.body
    
    try {
        let tipo_agente_id: number = data.tipo_agente_id ?? 0
        const usuario_id: number | undefined = data.usuario_id

        await prisma.$connect()

        if (tipo_agente_id === 0) {
            if (data.tipo_agente === undefined) {
                return res.status(400).json({success:false, message: 'Tipo_agente or tipo_agente_id not received!'})
            }

            tipo_agente_id = (await prisma.tipos_agentes.create({
                data: {
                    ...data.tipo_agente
                }
            })).id
        }

        if (usuario_id === undefined) {
            return res.status(404).json({message: 'Agente cant be created without user data or usuario_id'})
        }

        const nuevoAgente = await prisma.agentes.create({
            data: {
                ...data,
                tipo_agente_id,
                tipo_agente: undefined,
                usuario_id
            }
        })
        
        return res.json({success: true, message: 'Agente data was successfully created', data: nuevoAgente})
        
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Agente.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateAgent = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const data: Partial<Agentes> = req.body;

    try {
        const result = await prisma.agentes.update({
            where: { id }, data
        }).finally(async () => await prisma.$disconnect())

        return res.json({success: true, message: 'Agente data was successfully updated', data: result})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Agente id: ${id} data.`, data: error})
    }
}

export const UpdateAgentQueueStatus = (req: Request, res: Response) => {
    const usuario_id: number = res.locals.payload.id
    const data: updateAgentStatusType['body']  = req.body

    try {
        const result = setWaitingState({...data, usuario_id})
        
        if (result === false){
            return res.status(404).json({success: false,
                message: `Agente with usuario id ${usuario_id} availability was not updated`})
        }
        
        return res.json({success: true, message: `Agente with user id ${usuario_id} availability was updated!`})
        
        
    } catch (error) {
        return res.status(500).json({message: `Server status error updating Agente availability with user id: ${usuario_id} data.`, data: error})
    }
}

export const DeleteAgent = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.agentes.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Agente was update successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Agente id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Agente id: ${id}`, data: error});
    }
}