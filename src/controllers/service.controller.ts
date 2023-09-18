import { Request, Response } from 'express';
import { PrismaClient, Servicios } from '@prisma/client';
import { GetAllAvailableServicesInSucursal, getServiceById, getSucursalByUserId, refreshPersistentData } from '../core/global.state';
import { createServicesType, discriminateFilterServiceType, updateServicesType } from '../schemas/service.schema';

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
    const data: createServicesType['body'] = req.body;

    try {
        await prisma.$connect()
        let result: Servicios[] = []

        for (const servicio of data) {
            let grupo_id = servicio.grupo_id

            if (grupo_id === undefined) {
                if (servicio.grupo === undefined) {
                    return null
                }

                const grupo = await prisma.grupos_servicios.create({
                    data: servicio.grupo.body
                })

                grupo_id = grupo.id
            }

            result.push( await prisma.servicios.create({
                data: {
                    ...servicio,
                    grupo_id,
                    grupo: undefined,
                }
            }))
        };

        if (result.length === 0) {
            return res.status(400).json({success: false, message: "No Services were created, Group left!"})
        }

        refreshPersistentData()
        return res.json({success: true, message: 'Servicios data were successfully created', data: result})

    } catch (error) {
        return res.status(500).json({message: 'Server status error creating Servicios.', data: error})
    }
}

export const UpdateService = async (req: Request, res: Response) => {
    const id: updateServicesType['params']['id'] = Number(req.params.id)
    const data: updateServicesType['body'] = req.body;

    try {
        const result = await prisma.servicios.update({
            where: { id }, data
        }).finally(async () => await prisma.$disconnect())

        return res.json({success: true, message: 'Servicio data was successfully updated', data: result})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Servicio id: ${id} data.`, data: error})
    }
}

export const DeleteService = async (req: Request, res: Response) => {
    const id: updateServicesType['params']['id'] = Number(req.params.id)

    try {
        const result = await prisma.servicios.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Servicio was update successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Servicio id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Servicio id: ${id}`, data: error});
    }
}



export const getIdsFromDiscriminatedSearch = (filter: discriminateFilterServiceType): number[] => {
    const services_id: number[] = []
        
    if (filter.serviceField === 'id') {
        services_id.push(...filter.data_id.map( id => id))
    }
    
    if (filter.serviceField === 'nombre_corto') {
            filter.data_short.map(async nombre_corto => {
                const service = await prisma.servicios.findFirst({
                    where: { nombre_corto }
                })
                if (service) services_id.push(service.id)
            })
    }

    if (filter.serviceField === 'prefijo') {
        filter.data_prefix.map(async prefijo => {
            const service = await prisma.servicios.findFirst({
                where: { prefijo }
            })
            if (service) services_id.push(service.id)
        })
    }

    return services_id
}