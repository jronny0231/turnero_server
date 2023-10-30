import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getSecret } from '../services/jwt.helper';
import { payloadType } from '../@types/auth';
import { SocketType } from '../servers/socket.server';
import { ExtendedError } from 'socket.io/dist/namespace';

const TOKEN_SECRET: string = getSecret()

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  // Request and check bearer token from header
  const authHeader = req.get('authorization');

  if (authHeader === undefined) {
    return res.status(403).json({success: false, message: 'bearer token forbidden'})
  }
  
  const [tokenType, token] = authHeader.split(' ');

  if (tokenType !== 'Bearer' || typeof token !== 'string') {
    return res.status(403).json({success: false, message: 'bearer token invalid'})
  }
  
  // Verify token (iss, lifetime, structure) from jwt
  return jwt.verify(token, TOKEN_SECRET as string, (err: any, decode: any ) => {
    
    // If error return it
    if (err){
      return res.status(403).json({success:false, message: err.message});
    }

    const payload: payloadType = decode.data;

    res.locals.payload = payload;
    res.locals.token = token;

    return next()
  })
}

export const urlToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query

  if (typeof token !== 'string') {
    return res.status(403).json({success: false, message: 'bearer token invalid'})
  }
  
  // Verify token (iss, lifetime, structure) from jwt
  return jwt.verify(token, TOKEN_SECRET as string, (err: any, decode: any ) => {
    
    // If error return it
    if (err){
      return res.status(403).json({success:false, message: err.message});
    }

    const payload: payloadType = decode.data;

    res.locals.payload = payload;
    res.locals.token = token;

    return next()
  })
}

export const socketToken = (socket: SocketType, next: (err?: ExtendedError | undefined) => void) => {
  const token = socket.handshake.auth.token;

  if (typeof token !== 'string') {
    const error = new Error('bearer token invalid')
    return next(error)
  }
    
  // Verify token (iss, lifetime, structure) from jwt
  return jwt.verify(token, TOKEN_SECRET as string,  (err: any, decode: any ) => {
    
    // If error return it
    if (err){
      const error= new Error(err.message)
      return next(error)
    }

    socket.handshake.auth.payload = decode.data

    return next()
  })
}
  