import { UUID } from "crypto";
import { NextFunction } from "express";
import { stringToUUID } from "../utils/filtering";

export const getDisplayProps = async (req: any, res: any, next: NextFunction) => {
    
    // Aqui ira la logica con la tabla de Pantallas para comparar la informacion
    // del objeto request que servira de autenticacion ademas de brindar
    // informacion sobre la pantalla que hace la solicitud.
    const key: UUID | null = stringToUUID( req.get("X-Display-UUID") ?? "" )
    
    if(key === null){
        return res.status(403).json({message: "invalid X-Display-UUID header-key, please fix it and try again."});
    }
    
    res.locals.display = key
    // console.log("Display connected: ", key)
    next()
    return
}