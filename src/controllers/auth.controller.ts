import jwt from 'jsonwebtoken';

const PRIVATE_TOKEN_SECRET="@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°"
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;

export const createToken = ((payload: String, expiresIn: any) => {
    const EXPIRETIME = (expiresIn === null) ? '1800s' : expiresIn;
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: EXPIRETIME});
});

export const authenticateToken = ((req: Request, res: any, next: any) => {
    const authHeader = req.headers.get('authorization');

    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, TOKEN_SECRET as string, (err: any, payload: any) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.headers.set('payload', payload);
  
      next()
    })
});
  