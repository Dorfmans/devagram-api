import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { defaultMessage } from "../types/defaultMessage";
import jwt, {JwtPayload} from "jsonwebtoken";

export const tokenAuth = (handler: NextApiHandler) =>
(req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
    
    try{
        const {JWT_KEY} = process.env;
            if(!JWT_KEY){
                return res.status(500).json({error: 'Check ENV JWT_KEY'});
            }

        if(!req || !req.headers){
            return res.status(401).json({error: 'Not Authorized'});
        }

        if(req.method !== 'OPTIONS'){
            const authorization = req.headers['authorization'];
            if(!authorization){
                return res.status(401).json({error: 'Not Authorized'});
            }
        
            const token = authorization.substring(7);
            if(!token){
                return res.status(401).json({error: 'Not Authorized'});
            }
        
            const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
            if(!decoded){
                return res.status(401).json({error: 'Not Authorized'});
            }

            if(!req.query){
                req.query = {};
            }

            req.query.userId = decoded._id;
        }
    }catch(e){
        console.log(e);
        return res.status(401).json({error: 'Not Authorized'});
    }

return handler(req, res);
}
