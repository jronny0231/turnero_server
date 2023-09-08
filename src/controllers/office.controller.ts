import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createOfficeType, updateOfficeType } from '../schemas/office.schema';

const prisma = new PrismaClient;

export const getAllOffices = async (_req: Request, res: Response) => {
    try {
        const sucursales = await prisma.sucursales.findMany().finally(async () => await prisma.$disconnect())

        if (sucursales.length === 0) return res.status(404).json({message: 'Sucursales data was not found'})
        
        return res.json({success: true, message: 'Sucursales data was successfully recovery', data: sucursales})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Sucursales data.', data: error})
    }
}

export const GetOfficeById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const sucursal = await prisma.sucursales.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())

        if (sucursal === null) return res.status(404).json({message: `Sucursal id ${id} data was not found`})
        
        return res.json({success: true, message: `Sucursal id: ${id} data was successfully recovery`, data: sucursal})
        
    } catch (error) {
        return res.status(500).json({message: `Server status error getting Sucursal id: ${id} data.`, data: error})
    }
}

export const StoreNewOffice = async (req: Request, res: Response) => {
    const data: createOfficeType['body'] = req.body
    
    try {
        const nuevaSucursal = await prisma.sucursales.create({
            data
        })
        
        return res.json({success: true, message: 'Sucursal data was successfully created', data: nuevaSucursal})
        
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Sucursal.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateOffice = async (req: Request, res: Response) => {
    const id: updateOfficeType['params']['id'] = Number(req.params.id)
    const data: updateOfficeType['body'] = req.body;

    try {
        const result = await prisma.sucursales.update({
            where: { id }, data
        }).finally(async () => await prisma.$disconnect())

        return res.json({success: true, message: 'Sucursal data was successfully updated', data: result})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Sucursal id: ${id} data.`, data: error})
    }
}

export const DeleteOffice = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.sucursales.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Sucursal was update successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Sucursal id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Sucursal id: ${id}`, data: error});
    }
}