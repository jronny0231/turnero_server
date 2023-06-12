import { NextFunction } from "express";

export const getDisplayProps = async (_req: any, _res: any, next: NextFunction) => {
    
    // Aqui ira la logica con la tabla de Pantallas para comparar la informacion
    // del objeto request que servira de autenticacion ademas de brindar
    // informacion sobre la pantalla que hace la solicitud.
    
    
    next()
}