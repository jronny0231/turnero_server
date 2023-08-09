import {Request, Response, NextFunction } from "express";
import { getTokenById, setTokenById } from "../controllers/user.controller";

const asyncResult = {
  ok: true,
  data: {
    code: 200,
    msg: ""
  }
}

export const verifyActiveUserToken = (_req: Request, res: Response, next: NextFunction) => {
    
    const token: string = res.locals.payload.token;
    const id: number = res.locals.payload.id

    // Verify if user data in token is super user offline account
    if(res.locals.payload.type === "super"){
        next()
        return
      }
    
    // Verify asynchronously if online user account has same token stored.
    new Promise(async (resolve, reject) => {
      try{
        const loggedToken: string|null = await getTokenById(id);
  
        if(!loggedToken || (loggedToken !== token)){
          setTokenById(id, "");
          res.locals.payload = null;
          reject({
            code: 403,
            msg: 'invalid session token, user logged out'
          })
          return false
        }
        resolve({
          code: 200,
          msg: loggedToken
        })
        return true

      } catch(error){

        reject({
          code: 500,
          msg: 'error trying connect to database'
        })
        return false
      }
    }).then((result) => {
      asyncResult.data = {...result as {code: number, msg: string}}
    })
    .catch(error => {
      asyncResult.ok = false
      asyncResult.data = {...error as {code: number, msg: string}}      
    })
    
    if (asyncResult.ok) {
      next()
      return
    }

    return res.status(asyncResult.data.code).json({message: asyncResult.data.msg})
   
}