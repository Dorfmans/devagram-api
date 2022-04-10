import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { defaultMessage } from '../types/defaultMessage';


export const dbConnection = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

    const {DB_CONNECTION_STRING} = process.env;

    if(!DB_CONNECTION_STRING){
        return res.status(500).json({error: 'Check enviroment'});
    }

    mongoose.connection.on('connected', () => console.log('Database Connected'));
    mongoose.connection.on('error', error => console.log('Database NOT Connected'));
    await mongoose.connect(DB_CONNECTION_STRING);
    
    return handler(req, res);
}
