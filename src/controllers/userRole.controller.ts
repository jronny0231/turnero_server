import { Request, Response } from 'express';
import { PrismaClient, Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient;

export const GetAllRolesAndPermissions = async (_req: Request, res: Response) => {
    try {
        const roles = await prisma.roles.findMany({
            include: {
                roles_permisos: {
                    include: { permiso: true }
                }
            }
        }).finally(async () => await prisma.$disconnect())
        
        if (roles.length === 0) return res.status(404).json({message: 'Roles data was not found'})
        
        return res.json({success: true, message: 'Roles data was successfully recovery', data: roles})

    } catch (error) {
        return res.status(500).json({message: 'Server status error getting Roles data.', data: error})
    }
}

export const GetRoleAndPermissionsById = async (req: Request <{ id: number}>, res: Response) => {
    const id = Number(req.params.id);
    
    try {
        const role = await prisma.roles.findFirst({
            where: { id },
            include: {
                roles_permisos: {
                    include: { permiso: true }
                }
            }
        }).finally(async () => await prisma.$disconnect())
        
        if (role === null) return res.status(404).json({message: `role by id ${id} was not found`})
        
        return res.json({success: true, message: `role by id ${id} was successfully recovery`, data: role})

    } catch (error) {
        return res.status(500).json({message: `Server status error getting usuario by id ${id}.`, data: error})
    }
}

/**
 * Debe poder almacenar un nuevo registro en la tabla Roles
 * y ademas registros de vinculacion mucho a mucho con la tabla
 * Roles_permisos con sus valores booleanos definidos con
 * al menos un valor CRUD en true
 * @param req 
 * @param res 
 * @returns 
 */
export const StoreNewRole = async (req: Request, res: Response) => {
    const data: Roles = req.body;

    try {
        
        return res.json({sucess: true, message: ``, data})

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2000')
                return res.status(400).send({error: 'A field is too longer.', message: error.message});
    
            if(error.code === 'P2002')
                return res.status(400).send({error: 'Same user data already registred.', message: error.message});
                
        }
        return res.status(500).json({message: 'Server status error creating Grupos_servicios data.', data: error})
    }   
}

/**
 * Debe poder actualizar tanto los datos de registro del Rol
 * como tambien los permisos en la tabla Roles_Permisos con
 * al menos un valor CRUD en true
 * @param req 
 * @param res 
 * @returns 
 */
export const UpdateRoleAndPermissions = async (req: Request<{id: number}>, res: Response) => {
    const id = Number(req.params.id);
    const data: Roles = req.body;

    try {
        
        
        return res.json({success: true, message: ``, data})

    } catch (error) {
        return res.status(500).json({message: `Server status error updating Role and Permissions by id ${id}.`, data: error})
    }
}

export const DeleteRoleAndPermissions = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
   
    try {
        const role = await prisma.roles.delete({
            where: { id },
            include: { roles_permisos: true }
        }).finally(async () => await prisma.$disconnect())
        
        if (role === null) return res.status(404).json({message: `Role by id ${id} could not be deleted`})
        
        return res.json({success: true, message: `Role by id ${id} was successfully deleted`, data: role})

    } catch (error) {
        return res.status(500).json({message: `Server status error deleting Role by id ${id}.`, data: error})
    }
}