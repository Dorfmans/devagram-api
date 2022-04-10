/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnection } from '../../middlewares/dbConnection';
import type { defaultMessage } from '../../types/defaultMessage';
import { userModels } from '../../models/userModels'
import md5 from "md5";

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<defaultMessage>) => {

    if(req.method === 'POST')
    {
        const {login, password} = req.body;

        const hasUsers = await userModels.find({email : login, password : md5(password)})

        if(hasUsers && hasUsers.length > 0){
            const hasUser = hasUsers[0]
            return res.status(200).json({message: `Welcome ${hasUser.user}`});
        }

        return res.status(400).json({error: 'Did you sign up?'});
    }

    return res.status(405).json({error: 'Method invalid'});
} 

export default dbConnection(endpointLogin);