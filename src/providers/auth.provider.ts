import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from "../services/jwt.helper";
import { encryptPassword } from "../utils/filtering";
import { ZodError, z } from "zod"
import { passwordChangeType, updateUserType, userCredentialType } from "../schemas/user.schema";

const prisma = new PrismaClient;

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD ?? "%-d3fP4$$w0rd"


export const Login = async (req: Request, res: Response) => {
    const body: userCredentialType['body']  = req.body

    try {
        const superLogin = getSuperUserLogin(body)

        if (superLogin !== null) {
            return (superLogin.success) ? res.json(superLogin) : res.status(400).json(superLogin) 
        }

        await prisma.$connect()
        
        const user = await prisma.usuarios.findFirst({
            where:{ username: { equals: body.username, mode: 'insensitive' } }
        })

        if (user === null) {
            return res.status(400).json({success: false, message: 'Username or Password not match'});
        }

        if (user.activo === false) {
            return res.status(404).json({success: false, message: 'El usuario no esa activo, hable con su administrador'});
        }

        if (bcrypt.compareSync(DEFAULT_PASSWORD, user.password)) {
            return res.redirect("/auth/reset-password")
        }

        if (bcrypt.compareSync(body.password, user.password)) {
            const token = createToken({
                id: user.id,
                type: 'user',
                username: user.username,
                correo: user.correo
            })
            return res.json({success: true, data: token})
        }

        return res.status(400).json({success: false, message: 'Username or Password not match'}); 
  
    } catch (error) {
        console.error(`Error trying to login with username: ${body.username}`, {error})
        return res.status(500).json({success: false, message: `Error trying to login with username: ${body.username}`, data: error})
    
    } finally {
        await prisma.$disconnect()
    }
}

export const Logout = async (_req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);

    try {
        if (id === 0) {
            return res.json({success: true, message: "SuperUser logout successfully!"})
        }

        await prisma.usuarios.update({
            where: { id },
            data: { token: null }
        })

        res.locals.payload = null

        return res.json({success:true, message: "You are logged out!"})

    } catch (error) {
        console.error(`Error trying logging out user id: ${id}`, {error})
        return res.status(500).json({success: false, message: `Error trying logging out user id: ${id}`, data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const GetAccount = async (_req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);

    try {
        if(res.locals.payload.type === "super"){
            const data = getSuperUserData()
            if (data === null) {
                return res.status(500).json({message:"Super user data cant be recovery, check envirounment constants for SUPER_USER"})
            }
            return res.json({message:"Super user data recovery successfully", data})
        }

        const user = await prisma.usuarios.findFirst({
            where: { id }
        })

        if (user === null) {
            return res.status(404).json({success: false, message: 'User data not found'});
        }

        if (user.activo === false) {
            return res.status(404).json({success: false, message: 'El usuario no esa activo, hable con su administrador'});
        }

        return res.json({success: true, message: "User data recovery successfully", data: user})
    } catch (error) {
        console.error(`Error trying get account data for user id: ${id}`, {error})
        return res.status(500).json({success: false, message: `Error trying get account data for user id: ${id}`, data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateAccount = async (req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);
    const data: updateUserType['body'] = req.body;

    try {
        if(res.locals.payload.type === "super"){
            return res.status(403).json({message:"Cannont change super user data."})
        }

        const result = await prisma.usuarios.update({
            where: { id, activo: true }, data, select: {
                nombres: true, username: true, correo: true, updatedAt: true
            }
        })

        return res.json({success: true, message: 'User data was update successfully', data: result})

    } catch (error) {
        console.error(`Error trying update user data with id: ${id}`, {error})
        return res.status(500).json({success: false, message: `Error trying update user data with id: ${id}`, data: error})

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);
    const data: { current: string, new: string, confirm: string } = req.body

    try {
        const currVal = credentialsValidation({password: data.current})
        if (currVal.success === false) {
            return res.status(400).json(currVal)
        }

        const newVal = credentialsValidation({password: data.new, passwordCheck: data.confirm})
        if (newVal.success === false) {
            return res.status(400).json(newVal)
        }

        await prisma.$connect()
        
        const user = await prisma.usuarios.findFirst({
            where: { id }
        })

        if (user === null) {
            return res.status(404).json({success: false, message: `Username with id: ${id} not found`});
        }

        if (user.activo === false) {
            return res.status(400).json({success: false, message: 'El usuario no esa activo, hable con su administrador'});
        }

        if (bcrypt.compareSync(data.current, user.password)) {
            const password = await encryptPassword(data.new)
            await prisma.usuarios.update({
                where: { id }, data: { password }
            })

            return res.json({success: true, message: `Passsword for User id ${id} was update successfully!`, data: true})
        }

        return res.status(400).json({success: false, message: 'Current password not match'}); 
    } catch (error) {
        console.error(`Error trying update user password with id: ${id}`, {error})
        return res.status(500).json({success: false, message: `Error trying update user password with id: ${id}`, data: error})

    } finally {
        await prisma.$disconnect()
    }

}

export const ResetPassword = async (req: Request, res: Response) => {
    const id: passwordChangeType['params']['id'] = Number(req.params.id);
    try {
        await prisma.$connect()
        
        const user = await prisma.usuarios.findFirst({
            where: { id }
        })

        if (user === null) {
            return res.status(404).json({success: false, message: `Username with id: ${id} not found`});
        }

        const password = await encryptPassword(DEFAULT_PASSWORD)
        await prisma.usuarios.update({
            where: { id }, data: { password }
        })

        return res.json({success: true, message: `Passsword for User id ${id} was reset to default successfully!`, data: true})
    
    } catch (error) {
        console.error(`Error trying reset user password with id: ${id}`, {error})
        return res.status(500).json({success: false, message: `Error trying reset user password with id: ${id}`, data: error})

    } finally {
        await prisma.$disconnect()
    }
}

const getSuperUserData = () => {
    const data = process.env.SUPER_USER?.split(":")

    if (data === undefined) return null

    const id = 0
    const type = 'super'
    const username = data[0]
    const password = data[1]
    const correo = data[2] ?? undefined

    return { id, type, username, password, correo }
}

const getSuperUserLogin = (credentials: {username: string, password:string}) => {
    
    const superUser = getSuperUserData()

    if (superUser === null) {
        return {
            success: false,
            message: "Super user data not found, check environment data for SUPER_USER"
        }
    }

    const { id, type, username, password, correo } = superUser

    const validacion = credentialsValidation({username, password, correo})

    if (validacion.success === false){
        console.error({validations: validacion.data})
        return validacion
    }

    if (
        username.toLowerCase() === credentials.username.toLowerCase()
     && password === credentials.password
    ) {
        return {
            success: true,
            message: 'Super User login successfully!',
            data: {
                id,
                username,
                correo,
                type,
                token: createToken({id, type, username, correo})
            }
        } 
    }

    return {
        success: false,
        message: 'Super User login incorrect!'
    }
    
}



export const credentialsValidation = ({username, password, passwordCheck, correo}: {username?: string, password?: string, passwordCheck?: string, correo?: string}) => {
    try {
        z.object({
            correo: z.string().email().max(60).optional(),
            username: z.string().min(4).max(15)
                        .regex(/^[a-zA-Z][a-zA-Z0-9]*_[a-zA-Z0-9]*$/,
                            "Must start with uppercase and only include letters, numbers and one underscore")
                        .optional(),
            password: z.string().min(8).max(80)
                        .regex(/^(?=.*[a-z]).+$/,
                            "Must contain at least one LOWERCASE letter")

                        .regex(/^(?=.*[A-Z]).+$/,
                            "Must contain at least one UPPERCASE letter")

                        .regex(/^(?=.*[-+_!@#$%^&*., ?]).+$/,
                            "Must contain at least one SPECIAL character")
                        
                        .regex(/^(?=.*\d).+$/,
                            "Must contain at least one NUMBER")
                        .optional(),
            passwordCheck: z.string().min(8).max(80)
                        .regex(/^(?=.*[a-z]).+$/,
                            "Must contain at least one LOWERCASE letter")

                        .regex(/^(?=.*[A-Z]).+$/,
                            "Must contain at least one UPPERCASE letter")

                        .regex(/^(?=.*[-+_!@#$%^&*., ?]).+$/,
                            "Must contain at least one SPECIAL character")
                        
                        .regex(/^(?=.*\d).+$/,
                            "Must contain at least one NUMBER")
                        .optional(),
        }).parse({
            username,
            password,
            passwordCheck,
            correo
        })

        return {
            success: true
        }

    } catch (error) {
        if (error instanceof ZodError) {
            const data = error.issues.map((issue,_,errors) => {
                return {
                    key: issue.path[0],
                    messages: errors.filter(error => error.path === issue.path)
                                    .map(error => error.message)
                }
            })

            return {
                success: false,
                message: `Validation error on credentials`,
                data
            }
        }

        return {
            success: false
        }
    }
}