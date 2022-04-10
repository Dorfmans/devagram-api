import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from '../../models/userModels';

const userEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any>) => {
    
    try{
        const { userId } = req?.query;
        const user = await userModels.findById(userId);
        user.password = null;
        return res.status(200).json({user})
    }catch(e){
        console.log(e)
    }
    return res.status(400).json({error: 'Cannot find user data'})
}

export default  tokenAuth(dbConnection(userEndpoint));