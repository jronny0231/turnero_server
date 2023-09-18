import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addRelatedServicesToDepartmentType, createDepartmentType, createDepartmentWithRelatedServicesType, updateDepartmentType } from '../schemas/department.schema';
import { getIdsFromDiscriminatedSearch } from './service.controller';
import { discriminateFilterServiceType } from '../schemas/service.schema';

const prisma = new PrismaClient;

export const getAllDepartments = async (_req: Request, res: Response) => {
    try {
        const departamentos = await prisma.departamentos.findMany().finally(async () => await prisma.$disconnect())

        if (departamentos.length === 0) return res.status(404).json({message: 'Departamentos data was not found'})
        
        return res.json({success: true, message: 'Departamentos data was successfully recovery', data: departamentos})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Departamentos data.', data: error})
    }
}

export const GetDepartmentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const departamento = await prisma.departamentos.findFirst({
            where: { id }
        }).finally(async () => await prisma.$disconnect())

        if (departamento === null) return res.status(404).json({message: `Departamento id ${id} data was not found`})
        
        return res.json({success: true, message: `Departamento id: ${id} data was successfully recovery`, data: departamento})
        
    } catch (error) {
        return res.status(500).json({message: `Server status error getting Departamento id: ${id} data.`, data: error})
    }
}

export const StoreNewDepartment = async (req: Request, res: Response) => {
    const query: createDepartmentType['query'] = req.query
    const data: createDepartmentType['body'] = req.body
    
    try {
        const nuevoDepartamento = await prisma.departamentos.create({
            data
        })

        if (query.sucursal_id) {
            await prisma.departamentos_sucursales.create({
                data: {
                    sucursal_id: query.sucursal_id,
                    departamento_id: nuevoDepartamento.id
                }
            })
        }
        
        return res.json({success: true, message: 'Departamento data was successfully created', data: nuevoDepartamento})
        
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Departamento.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const StoreNewDepartmentWithServices = async (req: Request, res: Response) => {
    const query: createDepartmentWithRelatedServicesType['query'] = req.query
    const data: createDepartmentWithRelatedServicesType['body'] = req.body
    
    try {
        await prisma.$connect()

        const nuevoDepartamento = await prisma.departamentos.create({
            data: data.departamento
        })

        if (query.sucursal_id) {
            const result = await createSucursalDepartamentoServicios({
                sucursal_id: query.sucursal_id,
                departamento_id: nuevoDepartamento.id,
                servicios: data.servicios
            })

            return res.json({
                success: true,
                message: 'Departamento in sucursal with servicios data was successfully created',
                data: result
            })
           
        }

        const sucursales = await prisma.sucursales.findMany({select: { id: true }})

        if (sucursales.length > 0) {
            const results = []
            for (const sucursal of sucursales) {
                const result = await createSucursalDepartamentoServicios({
                    sucursal_id: sucursal.id,
                    departamento_id: nuevoDepartamento.id,
                    servicios: data.servicios
                })
                results.push(result)
            }

            return res.json({
                success: true,
                message: 'Departamento in all sucursales with servicios data was successfully created',
                data: results
            })
            
        }
        
        return res.json({success: true, message: 'Departamento with servicios data was successfully created', data: nuevoDepartamento})
        
    } catch (error) {
        return res.status(500).json({message: 'Server status error creating new Departamento with servicios.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateDepartment = async (req: Request, res: Response) => {
    const id: updateDepartmentType['params']['id'] = Number(req.params.id)
    const data: updateDepartmentType['body'] = req.body;

    try {
        const result = await prisma.departamentos.update({
            where: { id }, data
        })

        return res.json({success: true, message: 'Departamento data was successfully updated', data: result})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Departamento id: ${id} data.`, data: error})
    } finally {
        await prisma.$disconnect()
    }
}


export const AddServicesToDepartment = async (req: Request, res: Response) => {
    const id: addRelatedServicesToDepartmentType['params']['id'] = Number(req.params)
    const data: addRelatedServicesToDepartmentType['body'] = req.body
    
    try {
        await prisma.$connect()

        const findDepartamento = await prisma.departamentos.findFirst({
            where: { id }
        })

        if (findDepartamento === null) {
            return res.status(404).json({success: false, message: `Departamento with id ${id} not found`})
        }

        const result = await createSucursalDepartamentoServicios({
            sucursal_id: data.sucursal_id,
            departamento_id: findDepartamento.id,
            servicios: data.servicios
        })

        return res.json({
            success: true,
            message: 'Departamento in sucursal with servicios data was successfully created',
            data: result
        })

    } catch (error) {
        return res.status(500).json({message: 'Server status error adding servicios in Departamento.', data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const DeleteDepartment = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const result = await prisma.departamentos.delete({
            where: { id }
        }).finally( async () => await prisma.$disconnect())

        return res.json({success: true, message:"Departamento was deleted successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Departamento id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Departamento id: ${id}`, data: error});
    }
}

type createSDSs = {
    sucursal_id: number
    departamento_id: number,
    servicios: discriminateFilterServiceType
}

/**
 * Create sucursal_departament_services related
 */
export const createSucursalDepartamentoServicios = async (data: createSDSs) => {
    const sucursalDepartamento = await prisma.departamentos_sucursales.upsert({
        where: {
            departamento_id_sucursal_id: {
                sucursal_id: data.sucursal_id,
                departamento_id: data.departamento_id
            }
        },
        create: {
            sucursal_id: data.sucursal_id,
            departamento_id: data.departamento_id
        },
        update: {
            sucursal_id: data.sucursal_id,
            departamento_id: data.departamento_id
        },
        select: {
            refId: true,
            sucursal: { select: { descripcion: true }},
            departamento: { select: { descripcion: true }}
        }
    })

    const services_id = getIdsFromDiscriminatedSearch(data.servicios)

    const relatedServices = await prisma.$transaction([
        ...services_id.map( servicio_id => prisma.servicios_departamentos_sucursales.create({
            data: {
                servicio_id,
                departamento_sucursal_refId: sucursalDepartamento.refId
            }
        }))
    ])

    return {
            sucursal: sucursalDepartamento.sucursal.descripcion,
            departamento: sucursalDepartamento.departamento.descripcion,
            servicios: relatedServices
        }
}