import { Request, Response } from 'express';
import { Grupos_servicios, PrismaClient } from '@prisma/client';
import { createServicesGroupType, updateServiceGroupType } from '../schemas/service.schema';

const prisma = new PrismaClient


export const GetAllServicesGroup = async (_req: Request, res: Response) => {
    try {
        const Grupos_servicios = await prisma.grupos_servicios.findMany().finally(async () => await prisma.$disconnect())
        
        if (Grupos_servicios.length === 0) return res.status(404).json({message: 'Grupos_servicios data was not found'})
        
        return res.json({success: true, message: 'Grupos_servicios data was successfully recovery', data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Grupos_servicios data.', data: error})
    }
}

export const GetAllSelectableServicesGroup = async (_req: Request, res: Response) => {
    try {
        const Grupos_servicios = await prisma.grupos_servicios.findMany({
            where: { es_seleccionable: true }
        }).finally(async () => await prisma.$disconnect())
        
        if (Grupos_servicios.length === 0) return res.status(404).json({message: 'Selectables grupos_servicios data was not found'})
        
        return res.json({success: true, message: 'Selectables grupos_servicios data was successfully recovery', data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting selectables Grupos_servicios data.', data: error})
    }
}

export const GetServiceGroupById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const Grupos_servicios = await prisma.grupos_servicios.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (Grupos_servicios === null) return res.status(404).json({message: `Grupos_servicios by id ${id} was not found`})
        
        return res.json({success: true, message: `Grupos_servicios by id ${id} was successfully recovery`, data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: `Server status error getting Grupos_servicios by id ${id}.`, data: error})
    }
}

export const StoreNewServiceGroup = async (req: Request, res: Response) => {
    const data: createServicesGroupType['body'] = req.body;

    try {
        const Grupos_servicios = await prisma.grupos_servicios.createMany({
            data
        }).finally(async () => await prisma.$disconnect())
        
        return res.json({success: true, message: 'Grupos_servicios data were successfully store', data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error creating Grupos_servicios data.', data: error})
    }
}

export const UpdateServiceGroup = async (req: Request, res: Response) => {
    const id: updateServiceGroupType['params']['id'] = Number(req.params.id);
    const data: updateServiceGroupType['body'] = req.body;

    try {
        const Grupos_servicios = await prisma.grupos_servicios.update({
            where: { id }, data
        }).finally(async () => await prisma.$disconnect())
        
        if (Grupos_servicios === null) return res.status(404).json({message: `Grupos_servicios by id ${id} could not update`})
        
        return res.json({success: true, message: `Grupos_servicios by id ${id} was successfully update`, data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Grupos_servicios by id ${id}.`, data: error})
    }
}

export const DeleteServiceGroup = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const Grupos_servicios = await prisma.grupos_servicios.delete({
            where: { id }
        }).finally(async () => await prisma.$disconnect())
        
        if (Grupos_servicios === null) return res.status(404).json({message: `Grupos_servicios by id ${id} could not be deleted`})
        
        return res.json({success: true, message: `Grupos_servicios by id ${id} was successfully delete`, data: Grupos_servicios})

    } catch (error) {
        return res.status(500).json({message: `Server status error deleting Grupos_servicios by id ${id}.`, data: error})
    }
}