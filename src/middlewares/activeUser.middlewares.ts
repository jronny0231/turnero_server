import {Request, Response, NextFunction } from "express";
import { UserPermissions, payloadType } from "../@types/auth";
import { obtain } from "../providers/redis.provider";


const verbConversion = {
  GET: "read",
  POST: "create",
  PUT: "update",
  DELETE: "delete",
}


export const validateActiveUser = async (_req: Request, res: Response, next: NextFunction) => {

  const token: string | null = res.locals.token ?? null;
  const payload: payloadType | null = res.locals.payload ?? null;
    

  // Verify is token is valid
  if (token === null || payload === null) {
    return res.status(403).json({success: false, message: "Token forbidden!"})
  }

  // Valid if user data in token is super user offline account and return next to continue
  if (payload.type === 'SUPER'){
    return next()
  }

  // Verify asynchronously if online user account has same token stored.
  /*
  try {
    await prisma.$connect()

    const userAndPermissions = await prisma.usuarios.findFirst({
      where: { id: payload.id },
      include: {
        rol: {
          include: {
            roles_permisos: {
              include: {
                permiso: true
              }
            }
          }
        }
      }
    })

    if (userAndPermissions === null) {
      res.locals.token = null
      res.locals.payload = null
      return res.status(404).json({success: false, message: "User logged not found!"})
    }

    if (userAndPermissions.activo === false) {
      res.locals.token = null
      res.locals.payload = null
      return res.status(400).json({success: false, message: "User logged not active!"})
    }

    if (userAndPermissions.rol.activo === false) {
      res.locals.token = null
      res.locals.payload = null
      return res.status(400).json({success: false, message: "User logged role has not active!"})
    }

    if (userAndPermissions.token !== token) {
      res.locals.token = null
      res.locals.payload = null

      return res.status(404).json({success: false, message: "Invalid user token!"})
    }

    const data = userAndPermissions.rol.roles_permisos.map(rol_perm => {
      return {
        slug: rol_perm.permiso.slug,
        permit: { ...rol_perm } 
      } as RolePermissions
    })

    return next()

  } catch (error) {
    console.error("Internal server error on middleware checking user session.", {error})
    return res.status(500).json({success: false, message: "Internal server error on middleware checking user session.", data: error})
  
  } finally {
    await prisma.$disconnect()
  }

  */
}

export const validatePermission = (slug: UserPermissions['slug']) => 
async (req: Request, res: Response, next: NextFunction) =>{
  
  const user: payloadType = res.locals.payload;
  const token: string = res.locals.token;

  const method = req.method.toUpperCase() as keyof typeof verbConversion
  const verb = verbConversion[method]

  try {
    if (user.type === 'SUPER') {
      const permissions = await obtain<UserPermissions[]>('super-permissions')
      console.log({user, slug, verb, token, permissions})
      return next()
    }
    
    const storeData = await obtain(token)
    console.log({user, slug, verb, token, storeData})
    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, message: 'Error getting permissions from redis', data: error})
  }
}