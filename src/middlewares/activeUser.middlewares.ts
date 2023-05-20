import { NextFunction } from "express";
import { getTokenById, setTokenById } from "../controllers/user.controller";

export const verifyActiveUserToken = async (_req: any, res: any, next: NextFunction) => {
    
    const token: string = res.locals.payload.token;
    const id: number = res.locals.payload.id

    // Verify if user data in token is super user offline account
    if(res.locals.payload.type === "super"){
        next()
        return
      }
    
    // Verify if online user account has same token stored.
    const loggedToken: string|null = await getTokenById(id);

    if(!loggedToken || (loggedToken !== token)){
      setTokenById(id, "");
      res.locals.payloay = null;
      return res.status(403).json({message: "invalid session token, user logged out."});
    }

    next();
    return 
}