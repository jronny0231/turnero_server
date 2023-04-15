import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getTokenById, setTokenById } from './user.controller';

const PRIVATE_TOKEN_SECRET="@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°"
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;


export const createToken = ((payload: {}): string => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    data: payload
  }, PRIVATE_TOKEN_SECRET);
});

export const refreshToken = ((_req: any, res: any) => {
    const payload = res.locals.payload;

    if(payload.type === "user"){
      const token = createToken(payload);
      setTokenById(payload.id, token);
      return res.json({token});

    } else if(payload.type === "super"){
      const token = createToken(payload);
      return res.json({token});
    }
    return res.status(403).json({message: "invalid session token, user logged out."});
});

export const authenticateToken = ((req: any, res: any, next: NextFunction) => {
  const authHeader = req.get('authorization');

  if (authHeader === undefined) return res.status(403).json({message: 'bearer token forbidden'});
  
  const tokenType = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (tokenType !== 'Bearer' || token == null) return res.status(403).json({message: 'bearer token invalid'});
  
  jwt.verify(token, TOKEN_SECRET as string, async (err: any, payload: any) => {
    
    if (err){
      return res.status(403).json({message: err.message});
    }

    if(payload.data.type === "super"){
      res.locals.payload = payload.data;
      next()
      return
    }
    // Funcion para evaluar o resetear existencia de token en la base de datos.
    const loggedToken: string|null = await getTokenById(payload.data.id);

    if(!loggedToken || (loggedToken !== token)){
      setTokenById(payload.data.id,"");
      return res.status(403).json({message: "invalid session token, user logged out."});
    }

    res.locals.payload = payload.data;

    next()
  })
});
  