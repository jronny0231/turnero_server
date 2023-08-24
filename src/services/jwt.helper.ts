import jwt from 'jsonwebtoken';
import { payloadType } from '../@types/auth';

const PRIVATE_TOKEN_SECRET="@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°"
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;

export const createToken = ((payload: payloadType): string => {
  
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // exp after 12 hours
    data: payload
  }, TOKEN_SECRET);
});

export const getSecret = () => TOKEN_SECRET