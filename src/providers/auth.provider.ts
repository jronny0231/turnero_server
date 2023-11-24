import { Usuarios } from "@prisma/client";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from "../services/jwt.helper";
import { encryptPassword } from "../utils/filtering";
import { ZodError } from "zod"
import { passwordChangeType, updateUserType, userCredentialType, userSchema } from "../schemas/user.schema";
import { UserPermissions, payloadType } from "../@types/auth";
import { store, destroy, obtain } from "./redis.provider";
import path from 'path'
import logger from "../utils/logger";
import prisma from "../models/db/prisma";

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD ?? "%-d3fP4$$w0rd"

export const LoginForm = (_req: Request, res: Response) => {
    const pathfile = path.join(path.resolve('./'), '/src/pages/loginForm.html')
    console.log(pathfile)
    res.sendFile(pathfile);
}

export const ConfirmPasswordForm = (_req: Request, res: Response) => {
    const pathfile = path.join(path.resolve('./'), '/src/pages/resetPasswordForm.html')
    return res.sendFile(pathfile);
}


export const verifyUserName = async (req: Request, res: Response) => {
    const body = req.body

    try {
        await prisma.$connect()

        const { data: user, ...result } = await checkUserAccount(body.username)

        if (user === undefined) {
            return res.status(result.code).json({ ...result } as { success: boolean, message: string })
        }

        const token = createToken({
            id: user.id,
            type: 'USER',
            username: user.username,
            correo: user.correo
        })

        if (bcrypt.compareSync(DEFAULT_PASSWORD, user.password)) {
            return res.status(203).json({ sucess: true, message: `Redirect to update password form`, data: token })
        }

        return res.json({ sucess: true, message: `User ${body.username} confirmed!` })

    } catch (error) {
        console.error(`Error trying check account of username: ${body.username}`, { error })
        return res.status(500).json({ success: false, message: `Error trying check account of username: ${body.username}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}


export const Login = async (req: Request, res: Response) => {
    const body: userCredentialType['body'] = req.body

    try {
        const superLogin = getSuperUserLogin(body)

        if (superLogin !== null) {
            return (superLogin.success) ? res.json(superLogin) : res.status(400).json(superLogin)
        }

        const { data: user, ...result } = await checkUserAccount(body.username)

        if (user === undefined) {
            return res.status(result.code).json({ ...result })
        }

        /*
        if (bcrypt.compareSync(DEFAULT_PASSWORD, user.password)) {
            return res.redirect(req.baseUrl + '/reset-password' + '?token=' + token)
        }
        */

        if (bcrypt.compareSync(body.password, user.password)) {
            const payload: payloadType = {
                id: user.id,
                type: 'USER',
                username: user.username,
                correo: user.correo
            }
            const token = createToken(payload)

            prisma.usuarios.update({
                where: { id: user.id },
                data: { token }
            })

            new Promise(async () => {
                const permisos = await getRolePermissions(user.rol_id)

                const userAndPermissions = {
                    id: user.id,
                    permisos
                }

                // Store login data and token as key in redis
                store(token, userAndPermissions)
            })


            return res.json({ success: true, data: token })
        }

        return res.status(400).json({ success: false, message: 'Username or Password not match' });

    } catch (error) {
        logger.error(`Error trying to login with username: ${body.username}, ${error}`, console.error)
        return res.status(500).json({ success: false, message: `Error trying to login with username: ${body.username}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}

export const Logout = async (_req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);

    try {
        if (id === 0) {
            return res.json({ success: true, message: "SuperUser logout successfully!" })
        }

        await prisma.usuarios.update({
            where: { id },
            data: { token: null }
        })


        // Destroying redis data using token
        destroy(res.locals.token)

        res.locals.payload = null
        res.locals.token = null

        return res.json({ success: true, message: "You are logged out!" })

    } catch (error) {
        console.error(`Error trying logging out user id: ${id}`, { error })
        return res.status(500).json({ success: false, message: `Error trying logging out user id: ${id}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}

export const GetPermissions = async (_req: Request, res: Response) => {
    const user: payloadType = res.locals.payload;

    try {
        if (user.type === 'SUPER') {
            const permissions = await obtain<UserPermissions[]>('super-permissions')
            if (permissions === null) {
                return res.status(404).json({ success: false, message: "Super User permissions data is not defined!" })
            }
            return res.json({ success: true, data: permissions })
        }

        const permissions = await getRolePermissions(user.id);
        return res.json({ success: true, data: permissions })

    } catch (error) {
        console.error(`Error getting permissions of user: ${user.username}`, { error })
        return res.status(500).json({ success: false, message: `Error getting permissions of user: ${user.username}`, data: error })

    } finally {
        await prisma.$disconnect()
    }

}

export const GetAccount = async (_req: Request, res: Response) => {
    const payload: payloadType = res.locals.payload;

    try {
        if (payload.type === 'SUPER') {
            const data = getSuperUserData()
            if (data === null) {
                return res.status(500).json({ message: "Super user data cant be recovery, check envirounment constants for SUPER_USER" })
            }
            return res.json({ message: "Super user data recovery successfully", data })
        }

        const user = await prisma.usuarios.findFirst({
            where: { id: payload.id }
        })

        if (user === null) {
            return res.status(404).json({ success: false, message: 'User data not found' });
        }

        if (user.activo === false) {
            return res.status(404).json({ success: false, message: 'El usuario no esa activo, hable con su administrador' });
        }

        return res.json({ success: true, message: "User data recovery successfully", data: user })
    } catch (error) {
        console.error(`Error trying get account data for user id: ${payload.id}`, { error })
        return res.status(500).json({ success: false, message: `Error trying get account data for user id: ${payload.id}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdateAccount = async (req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);
    const data: updateUserType['body'] = req.body;

    try {
        if (res.locals.payload.type === "super") {
            return res.status(403).json({ message: "Cannont change super user data." })
        }

        const result = await prisma.usuarios.update({
            where: {
                id,
                activo: true
            },
            data: {
                ...data,
                agentes: undefined
            },
            select: {
                nombres: true, username: true, correo: true, updatedAt: true
            }
        })

        return res.json({ success: true, message: 'User data was update successfully', data: result })

    } catch (error) {
        console.error(`Error trying update user data with id: ${id}`, { error })
        return res.status(500).json({ success: false, message: `Error trying update user data with id: ${id}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);
    const data: { current: string, new: string, confirm: string } = req.body

    try {
        const currVal = credentialsValidation({ password: data.current })
        if (currVal.success === false) {
            return res.status(400).json(currVal)
        }

        const newVal = credentialsValidation({ password: data.new, passwordCheck: data.confirm })
        if (newVal.success === false) {
            return res.status(400).json(newVal)
        }

        await prisma.$connect()

        const user = await prisma.usuarios.findFirst({
            where: { id }
        })

        if (user === null) {
            return res.status(404).json({ success: false, message: `Username with id: ${id} not found` });
        }

        if (user.activo === false) {
            return res.status(400).json({ success: false, message: 'El usuario no esa activo, hable con su administrador' });
        }

        if (bcrypt.compareSync(data.current, user.password)) {
            const password = await encryptPassword(data.new)
            await prisma.usuarios.update({
                where: { id }, data: { password }
            })

            return res.json({ success: true, message: `Passsword for User id ${id} was update successfully!`, data: true })
        }

        return res.status(400).json({ success: false, message: 'Current password not match' });
    } catch (error) {
        console.error(`Error trying update user password with id: ${id}`, { error })
        return res.status(500).json({ success: false, message: `Error trying update user password with id: ${id}`, data: error })

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
            return res.status(404).json({ success: false, message: `Username with id: ${id} not found` });
        }

        const password = await encryptPassword(DEFAULT_PASSWORD)
        await prisma.usuarios.update({
            where: { id }, data: { password }
        })

        return res.json({ success: true, message: `Passsword for User id ${id} was reset to default successfully!`, data: true })

    } catch (error) {
        console.error(`Error trying reset user password with id: ${id}`, { error })
        return res.status(500).json({ success: false, message: `Error trying reset user password with id: ${id}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}

export const RefreshToken = async (_req: any, res: any) => {
    const payload: payloadType = res.locals.payload;

    try {
        const token = createToken(payload)
        if (payload.type === 'USER') {
            await prisma.usuarios.update({
                where: { id: payload.id },
                data: { token }
            })
        }

        return res.json({ success: true, data: token })

    } catch (error) {
        console.error(`Error trying refresh token to user: ${payload.username}`, { error })
        return res.status(500).json({ success: false, message: `Error trying refresh token to user: ${payload.username}`, data: error })

    } finally {
        await prisma.$disconnect()
    }
}


const checkUserAccount = async (username: string): Promise<{ code: number, success: boolean, message: string, data?: Usuarios }> => {
    const user = await prisma.usuarios.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } }
    })

    if (user === null) {
        return {
            code: 400,
            success: false,
            message: 'Username or Password not match'
        };
    }

    if (user.activo === false) {
        return {
            code: 404,
            success: false,
            message: `User ${username} is not active, comunicate with administrator`
        };
    }

    return {
        code: 200,
        success: true,
        message: `User ${username} is successfully getted`,
        data: user
    };
}

const getRolePermissions = async (rol_id: number): Promise<UserPermissions[]> => {
    const permissions = await prisma.permisos.findMany({
        where: {
            roles_permisos: {
                some: { rol_id }
            }
        },
        include: { roles_permisos: true, }
    });

    return permissions.flatMap(entry =>
        entry.roles_permisos.map(permission => ({
            id: entry.id,
            slug: entry.slug,
            can: {
                create: permission.create,
                read: permission.read,
                update: permission.update,
                delete: permission.delete
            }
        }))
    );
}

const getSuperUserData = () => {

    const id = 0
    const type: payloadType['type'] = 'SUPER'
    const username = process.env.SUPER_USER
    const password = process.env.SUPER_PASSWORD
    const correo = process.env.SUPER_EMAIL ?? ""

    if (username === undefined || password === undefined) return null

    return { id, type, username, password, correo }
}

const getSuperUserLogin = (credentials: { username: string, password: string }) => {

    const superUser = getSuperUserData()

    if (superUser === null) {
        return {
            success: false,
            message: "Super user data not found, check environment data for SUPER_USER"
        }
    }

    const { id, type, username, password, correo } = superUser

    if (username !== credentials.username) {
        return null
    }

    const validacion = credentialsValidation({ username, password, correo })

    if (validacion.success === false) {
        console.error({ validations: validacion.data })
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
                token: createToken({ id, type, username, correo })
            }
        }
    }

    return {
        success: false,
        message: 'Super User login incorrect!'
    }

}



const credentialsValidation = (
    { username, password, passwordCheck, correo }:
        { username?: string, password?: string, passwordCheck?: string, correo?: string }) => {

    try {
        userSchema.pick({
            correo: true,
            username: true,
            password: true,
        }).optional()
            .parse({
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
            const data = error.issues.map((issue, _, errors) => {
                return {
                    key: issue.path.join(" > "),
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