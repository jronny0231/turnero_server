import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const PRIVATE_TOKEN_SECRET="@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°"
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;


export const authToken = ((req: any, res: any, next: NextFunction) => {
  // Request and check bearer token from header
  const authHeader = req.get('authorization');

  if (authHeader === undefined) return res.status(403).json({message: 'bearer token forbidden'});
  
  const tokenType = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (tokenType !== 'Bearer' || token == null) return res.status(403).json({message: 'bearer token invalid'});
  
  // Verify token (iss, lifetime, structure) from jwt
  jwt.verify(token, TOKEN_SECRET as string, async (err: any, payload: any) => {
    
    // If error return it
    if (err){
      return res.status(403).json({message: err.message});
    }

    // Verify if user data in token is super user offline account
    if(payload.data.type === "super"){
      res.locals.payload = payload.data;
      next()
      return
    }

    // Set response local variables with verify user data payload 
    res.locals.payload = payload.data;
    res.locals.payload.token = token;

    next()
  })
});
  