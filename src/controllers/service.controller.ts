import { Request, Response } from 'express';
import { PrismaClient, Servicios } from '@prisma/client';
import { GetAllAvailableServicesInSucursal, getServiceById, getSucursalByUserId, refreshPersistentData } from '../core/global.state';
import { createServicesType } from '../schemas/service.schema';

const prisma = new PrismaClient;

export const GetAllServices = async (_req: Request, res: Response) => {
    try {
        const servicios: Servicios[] = await prisma.servicios.findMany().finally(async () => await prisma.$disconnect())
        
        if (servicios.length === 0) return res.status(404).json({message: 'Services data was not found'})
        
        return res.json({success: true, message: 'Services data was successfully recovery', data: servicios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Services data.', data: error})
    }
}


export const GetAllAvailableServices = (req: Request, res: Response) => {
    const grupo_id = req.query.group ? Number(req.query.group) : undefined
    const es_seleccionable = req.query.selectable ? Boolean(req.query.selectable) : undefined
    const user_id: number = res.locals.payload.id; 

    try {
        const sucursal = getSucursalByUserId(user_id)
        const grupoServicios = GetAllAvailableServicesInSucursal({
            sucursal_id: sucursal.id,
            grupo_id,
            es_seleccionable
        })
        
        if (grupoServicios === null) return res.status(404).json({message: `Available Servicios in Sucursal ${sucursal.descripcion} were not found`})
        
        return res.json({success: true, message: `Available Servicios in Sucursal ${sucursal.descripcion} were successful recovery`, data: grupoServicios})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Servicios in Sucursal.', data: error})
    }
}


export const GetServiceById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        const result = getServiceById(id)

        if (result === null)
            return res.status(404).json({success: false, message: `No Service was found with id: ${id}`})

        return res.json({success: true, message: 'Seervice data was successfully recovery', data: result})

    } catch (error) {
        return res.status(500).json({success: false, message: 'Server status error finding Seervice data.', data: error})
    }
}

export const StoreNewServices = async (req: Request, res: Response) => {
    const data: createServicesType = req.body;

    try {
        const result = await prisma.$transaction(
            data.map(entry => prisma.servicios.create({ data: entry }) )
        )

        if (result === undefined) {
            return res.status(400).json({success: false, message: "Algunos registros de servicios no se crearon"})
        }

        refreshPersistentData()
        return res.json({success: true, message: 'Servicio data was successfully created', data: result})

    } catch (error) {
        return res.status(500).json({message: 'Server status error creating Servicios.', data: error})
    }
}

export const UpdateService = ((_req: Request, res: Response) => {
    return res.json('Update a Servicios');
})

export const DeleteService = ((_req: Request, res: Response) => {
    return res.json('Delete a Servicios');
})