import jwt from 'jsonwebtoken';
import { setTokenById } from '../controllers/user.controller';
import { ObjectFiltering } from '../utils/filtering';

const PRIVATE_TOKEN_SECRET="@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°"
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;

export const getSecret = (): string => TOKEN_SECRET

export const createToken = ((payload: object): string => {
  
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // exp after 12 hours
    data: payload
  }, TOKEN_SECRET);
});

export const refreshToken = ((_req: any, res: any) => {
    const payload = res.locals.payload;

    if(payload.type === "user"){
      const filterPayload = ObjectFiltering(payload, ['id', 'username','correo']);
      const token = createToken({type:"user", ...filterPayload});

      setTokenById(payload.id, token);

      return res.json({token});

    } else if(payload.type === "super"){

      const token = createToken(payload);
      return res.json({token});
    }
    
    return res.status(403).json({message: "invalid session token, user logged out."});
});