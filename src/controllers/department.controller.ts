import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addRelatedServicesToDepartmentType, createDepartmentType, createDepartmentWithRelatedServicesType, updateDepartmentType } from '../schemas/department.schema';

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
            const sucursalDepartamento = await prisma.departamentos_sucursales.create({
                data: {
                    sucursal_id: query.sucursal_id,
                    departamento_id: nuevoDepartamento.id
                }
            })

            const servicios = await prisma.servicios.findMany()
            
            await prisma.$transaction([
                ...data.servicios.data.map( servicio => {
                    const type = data.servicios.serviceField
    
                    if (type === 'id') {
                        return prisma.servicios_departamentos_sucursales.create({
                            data: {
                                servicio_id: Number(servicio),
                                departamento_sucursal_refId: sucursalDepartamento.refId
                            },
                        select: { servicio: true }
                        })
                    }
    
                    if (type === 'nombre_corto') {
                        const idServicio = servicios.filter(service => service.nombre_corto === servicio)[0]
                        return prisma.servicios_departamentos_sucursales.create({
                            data: {
                                servicio_id: idServicio.id,
                                departamento_sucursal_refId: sucursalDepartamento.refId
                            },
                        select: { servicio: true }
                        })
                    }
    
                    // Prefijo
                    const idServicio = servicios.filter(service => service.prefijo === servicio)[0]
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: idServicio.id,
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    })
                })
            ])
           
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
    const params = req.params as unknown as addRelatedServicesToDepartmentType['params']
    const data: addRelatedServicesToDepartmentType['body'] = req.body
    
    try {
        await prisma.$connect()

        const findDepartamento = await prisma.departamentos.findFirst({
            where: { id: params.id }
        })

        if (findDepartamento === null) {
            return res.status(404).json({success: false, message: `Departamento with id ${params.id} not found`})
        }


        const sucursalDepartamento = await prisma.departamentos_sucursales.upsert({
            where: {
                departamento_id_sucursal_id: {
                    sucursal_id: data.sucursal_id,
                    departamento_id: findDepartamento.id
                }
            },
            create: {
                sucursal_id: data.sucursal_id,
                departamento_id: findDepartamento.id
            },
            update: {
                sucursal_id: data.sucursal_id,
                departamento_id: findDepartamento.id
            }
        })

        const servicios = await prisma.servicios.findMany()
        
        const relatedServices = await prisma.$transaction([
            ...data.servicios.data.map( servicio => {
                const type = data.servicios.serviceField

                if (type === 'id') {
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: Number(servicio),
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    })
                }

                if (type === 'nombre_corto') {
                    const idServicio = servicios.filter(service => service.nombre_corto === servicio)[0]
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: idServicio.id,
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    })
                }

                // Prefijo
                const idServicio = servicios.filter(service => service.prefijo === servicio)[0]
                return prisma.servicios_departamentos_sucursales.create({
                    data: {
                        servicio_id: idServicio.id,
                        departamento_sucursal_refId: sucursalDepartamento.refId
                    },
                        select: { servicio: true }
                })
            })
        ])
        
        return res.json({success: true, message: 'Servicios in Departamento data was successfully added', data: {...findDepartamento, relatedServices}})
        
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

        return res.json({success: true, message:"Sucursal was update successfully!", data: result})

    } catch (error) {
        console.error(`Error trying delete Sucursal id: ${id}`, {error}) 
        return res.status(404).json({success: false, message: `Error trying delete Sucursal id: ${id}`, data: error});
    }
}