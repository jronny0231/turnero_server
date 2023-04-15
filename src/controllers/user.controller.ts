import { Delete, GetAll, GetBy, GetById, Store, Update } from '../models/user.model';
import { UsuarioTypes, storeUsuarioTypes, updateUsuarioTypes } from '../types/user';
import { createToken}  from './auth.controller';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';


const PASSWORD_SALT = 10;
const DEFAULT_PASSWORD = "1234abcd";

const INPUT_TYPES_USUARIOS: string[] = ['nombres','correo','username','password','rol_id'];
const OUTPUT_TYPES_USUARIOS: string[] = ['id','nombres','correo','username','rol','activo','createdAt','updateAt'];

const SUPER_USER = {
    username: "nautilus",
    password: "@AvadaKedavra1993"
  }

const encryptPassword = async (password: string | null): Promise<string> => {
  const passwordValue: string = password ?? DEFAULT_PASSWORD;
  let hashedPassword: string = passwordValue;

  return bcrypt
    .genSalt(PASSWORD_SALT)
    .then(async salt => {
      return bcrypt.hash(passwordValue, salt)
    })
    .then(hashed => hashed)
    .catch(err => {
      console.error(err.message)
      return hashedPassword;
    })
}


export const GetAllUsers = ((_req: Request, res: Response) => {

    GetAll().then((users => {
        
        const data = users.map((user) => {
            return <UsuarioTypes> ObjectFiltering(user, OUTPUT_TYPES_USUARIOS);
        })

        res.send({sucess: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})
// How to convert string to number in typescript?       
export const GetUserById = ((req: Request <{ id: number}>, res: Response) => {
    const id: number = Number(req.params.id);
    GetById(id).then((user => {
        const data = <UsuarioTypes> ObjectFiltering(user, OUTPUT_TYPES_USUARIOS);

        res.send({sucess: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

export const StoreNewUser = ((req: Request, res: Response) => {
    const data: storeUsuarioTypes = req.body;

    if(ObjectDifferences(data, INPUT_TYPES_USUARIOS).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_USUARIOS})
    }

    encryptPassword(data.password ?? null).then((password) => {
        data.password = password;
        Store(data).then((newUser => {
            const data = <UsuarioTypes> ObjectFiltering(newUser, OUTPUT_TYPES_USUARIOS);

            return res.send({message: 'User created successfully!', data});
    
        })).catch(async (error) => {
    
            if(error.code === 'P2000')
                return res.status(400).send({error: 'Un campo tiene un valor demasiado largo.'});
    
            if(error.code === 'P2002')
                return res.status(400).send({error: 'Ya se encuentra un usuario con los mismos datos.'});
            
            return res.status(400).send({error: error.message});
        })
    })

    return
    
})

export const UpdateUser = ((req: Request<{id: number}>, res: Response) => {
    const id: number = Number(req.params.id);
    const bodyData: updateUsuarioTypes = req.body;

    Update(id, bodyData).then((updateUser => {
        const data = <UsuarioTypes> ObjectFiltering(updateUser, OUTPUT_TYPES_USUARIOS);
        
        return res.send({sucess: true, data});

    })).catch(async (error) => {

        return res.status(400).send({error: error.message});
        
    })
})

export const UpdateAccount = ((req: Request, res: Response) => {
    const id: number = Number(res.locals.payload.id);
    const bodyData: updateUsuarioTypes = req.body;

    if(res.locals.payload.type === "super"){
        res.status(403).json({message:"Cannont change super user data."})
        return;
    }
        

    Update(id, bodyData).then((updateUser => {
        const data = <UsuarioTypes> ObjectFiltering(updateUser, OUTPUT_TYPES_USUARIOS);

        return res.send({sucess: true, data});

    })).catch(async (error) => {

        return res.status(400).send({error: error.message});
        
    })
})

export const UpdatePassword = ((req: Request<{id: number}>, res: Response) => {
    const id: number = Number(req.params.id ?? res.locals.payload.id);

    if(id === 0){
        res.status(403).json({message:"Cannont change super user data."})
        return;
    }

    encryptPassword(req.body.password ?? null).then((password) => {
        Update(id, {password}).then((_user => {

            return res.send({sucess: true});

        })).catch(async (error) => {
            res.status(400).send({error: error.message})
        })
    })
    
})

export const DeleteUser = ((req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    Delete(id).then((result) => {
        console.log(result);
        return res.json({success: true});
    
    }).catch(async (error) => {
        res.status(400).send({error: error.message})
    })
})



export const Login = (async (req: Request, res: Response) => {
    const body = req.body;
    if(body === undefined) return res.sendStatus(400);

    const {username, password} = body;

    if(!username || !password) return res.status(400).json({message: 'username or password forbiden'});

    // Verify superUser Credencials
    if(username === SUPER_USER.username && password === SUPER_USER.password) {
        const token = createToken({type:"super", id:0, username, correo:"super@user.com"});
        return res.json({token});
    }
    await GetBy({username})
    .then(async (user: UsuarioTypes) => {
        const isEqual: boolean = bcrypt.compareSync(password, user.password)
        if(isEqual) {
            const filterUser = ObjectFiltering(user, ['id', 'username','correo']);
            const token = createToken({type:"user", ...filterUser});
            await Update(user.id,{token})
            return res.json({token});
        }
        return res.status(400).json({message: 'username or password not match'});
    })
    .catch((error) =>{
        console.error({error})
        return res.status(400).json({message: 'username or password not match', errorcode: error.code});
    })

    return res.status(400);
});

export const Logout = (async (_req: Request, res: Response) => {
    const id = res.locals.payload.id;
    if(id > 0) {
        await Update(id, {token: ""}).then((_data => {
            return res.status(200).json({message:'you are logged out'});
    
        })).catch(async (error) => {
            return res.status(400).send({error: error.message});
        })
    }
    
})

export const getTokenById = (async (id: number): Promise<string | null> => {
    const token = await GetById(id).then((user) => user.token).catch((error) => {
        console.error(error);
        return null
    });
    return token ?? null;
})

export const setTokenById = ((id: number, token: string): boolean => {
    Update(id, {token}).then((_user) => {
        return true;
    }).catch((error) => {
        console.error(error);
        return false;
    })
    return false;
})
