import { Request, Response } from 'express';
import { PrismaClient, Usuarios } from '@prisma/client';

const prisma = new PrismaClient;

export const GetAllUsers = (res: Response) => {

   
}

export const GetUserById = (req: Request <{ id: number}>, res: Response) => {
    const id: number = Number(req.params.id);
    
}


export const StoreNewUser = async (req: Request, res: Response) => {
    const data: Usuarios = req.body;

    
/*
    encryptPassword(data.password ?? null).then((password) => {
        data.password = password;
        UserModel.Store(data).then((newUser => {
            const data = <Usuarios> ObjectFiltering(newUser, OUTPUT_TYPES_USUARIOS);

            return res.send({message: 'User created successfully!', data});
    
        })).catch(async (error) => {
    
            if(error.code === 'P2000')
                return res.status(400).send({error: 'A field is too longer.', message: error.message});
    
            if(error.code === 'P2002')
                return res.status(400).send({error: 'Same user data already registred.', message: error.message});
            
            return res.status(400).send({error: error.message});
        })
    })
*/
    
}

export const UpdateUser = ((req: Request<{id: number}>, res: Response) => {
    const id: number = Number(req.params.id);
    const bodyData: Usuarios = req.body;

   
})


export const DeleteUser = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    
}


/*

export const Logout = (async (_req: Request, res: Response) => {
    const id = res.locals.payload.id;
    if(id > 0) {
        await UserModel.Update(id, {token: ""}).then((_data => {
            return res.status(200).json({message:'you are logged out'});
    
        })).catch(async (error) => {
            return res.status(400).send({error: error.message});
        })
    }
    
})

export const getTokenById = (async (id: number): Promise<string | null> => {
    const token = await UserModel.GetById(id).then((user) => {
        if(!user.activo) return null;
        return user.token
    }).catch((error) => {
        console.error(error);
        return null
    });
    return token ?? null;
})

export const setTokenById = ((id: number, token: string): boolean => {
    UserModel.Update(id, {token}).then((_user) => {
        return true;
    }).catch((error) => {
        console.error(error);
        return false;
    })
    return false;
})
*/