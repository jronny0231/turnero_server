import { Usuarios } from "@prisma/client"

export type storeUsuarioTypes = Omit<Usuarios,
 'id'|'token'|'createdAt'|'updatedAt'>

export type updateUsuarioTypes = Omit<Usuarios,
'id'|'password'|'token'|'createdAt'|'updatedAt'>
