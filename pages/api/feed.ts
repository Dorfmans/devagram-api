import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { postModels } from '../../models/postModels'
import { userModels } from '../../models/userModels'

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any>) => {
    
    try{

        if(req.method === 'GET'){
            if(req?.query?.id){
                const user = await userModels.findById(req?.query?.id);

                if(!user){
                    return res.status(400).json({error: 'User not found'})
                }

                const post = await postModels
                .find({user: user._id})
                .sort({date: -1});

                return res.status(200).json({post})
            }
        }
    }catch(e){
        console.log(e)
    }
    return res.status(405).json({error: 'Cannot get feed'})
}

export default tokenAuth(dbConnection(feedEndpoint));