export type UsuarioTypes = {
    id: number,
    nombres: string,
    correo: string,
    username: string,
    password:  string,
    rol?: Rol,
    rol_id?: number,
    activo: boolean,
    token?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export type storeUsuarioTypes = Omit<UsuarioTypes,
 'id'|'token'|'createdAt'|'updatedAt'>

export type updateUsuarioTypes = Omit<UsuarioTypes,
'id'|'password'|'token'|'createdAt'|'updatedAt'>

export type Roles = {
    id?: number,
    nombre?: string,
    descripcion?: string,
    activo?: boolean
}