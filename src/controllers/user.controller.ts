import { Request, Response } from 'express';
import { PrismaClient, Usuarios } from '@prisma/client';
import { encryptPassword } from '../utils/filtering';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createUserType } from '../schemas/user.schema';

const prisma = new PrismaClient;

export const GetAllUsers = async (_req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuarios.findMany().finally(async () => await prisma.$disconnect())
        
        if (usuarios.length === 0) return res.status(404).json({message: 'Usuarios data was not found'})
        
        return res.json({success: true, message: 'Usuarios data was successfully recovery', data: usuarios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Usuarios data.', data: error})
    }
}

export const GetUserById = async (req: Request <{ id: number}>, res: Response) => {
    const id = Number(req.params.id);
    
    try {
        const usuario = await prisma.usuarios.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (usuario === null) return res.status(404).json({message: `Usuario by id ${id} was not found`})
        
        return res.json({success: true, message: `Usuario by id ${id} was successfully recovery`, data: usuario})

    } catch (error) {
        return res.status(500).json({message: `Server status error getting usuario by id ${id}.`, data: error})
    }
}


export const StoreNewUser = async (req: Request, res: Response) => {
    const data: createUserType['body'] = req.body;

    try {

        await prisma.$connect()

        const password = await encryptPassword(data.password)
        const usuario = await prisma.usuarios.create({
            data: {
                ...data,
                password,
                agentes: undefined
            },
            select: {
                id: true,
                username: true,
                agentes: true
            }
        })
        
        if (data.agente === undefined) {
            if (data.agente_id === undefined) {
                return res.json({success: true, message: 'Usuario without Agente data was successfully store', data: usuario})
            }

            const agente = await prisma.agentes.update({
                where: { id: data.agente_id },
                data: { usuario_id: usuario.id }
            })

            return res.json({success: true, message: `Usuario with Agente_id ${agente.id} data was successfully store`, data: {usuario, agente}})
        }

        let tipo_agente_id: number = 0

        if (data.agente.body.tipo_agente === undefined) {
            if (data.agente.body.tipo_agente_id === undefined) {
                return res.status(400).json({success: false, message: `Could not create agente without agente_tipo_id or agente_tipo data`})
            }

            const tipo_agente = await prisma.tipos_agentes.findFirst({
                where: { id: data.agente.body.tipo_agente_id }
            })

            if (tipo_agente === null) {
                return res.status(400).json({success: false, message: `Could not create agente because agente_tipo_id not match`})
            }

            tipo_agente_id = tipo_agente.id
        } else {
            const tipo_agente = await prisma.tipos_agentes.create({
                data: {
                    ...data.agente.body.tipo_agente
                }
            })
            tipo_agente_id = tipo_agente.id
        }
        
        const agente = await prisma.agentes.create({
            data: {
                ...data.agente.body,
                usuario_id: usuario.id,
                tipo_agente: undefined,
                tipo_agente_id
            }
        })

        return res.json({success: true, message: `Usuario with Agente_id ${agente.id} data was successfully store`, data: {usuario, agente}})
        

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2000')
                return res.status(400).send({error: 'A field is too longer.', message: error.message});
    
            if(error.code === 'P2002')
                return res.status(400).send({error: 'Same user data already registred.', message: error.message});
                
        }
        return res.status(500).json({message: 'Server status error creating Grupos_servicios data.', data: error})
    
    } finally {
        await prisma.$disconnect()
    }  
}

export const UpdateUser = async (req: Request<{id: number}>, res: Response) => {
    const id: number = Number(req.params.id);
    const data: Usuarios = req.body;

    try {
        const usuario = await prisma.usuarios.update({
            where: { id }, data
        }).finally(async () => await prisma.$disconnect())
        
        if (usuario === null) return res.status(404).json({message: `Usuario by id ${id} could not update`})
        
        return res.json({success: true, message: `Usuario by id ${id} was successfully update`, data: usuario})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Usuario by id ${id}.`, data: error})
    }
}

export const DeleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
   
    try {
        const usuario = await prisma.usuarios.delete({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (usuario === null) return res.status(404).json({message: `Usuario by id ${id} could not be deleted`})
        
        return res.json({success: true, message: `Usuario by id ${id} was successfully deleted`, data: usuario})

    } catch (error) {
        return res.status(500).json({message: `Server status error deleting usuario by id ${id}.`, data: error})
    }
}