import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from '../../models/userModels';
// import nc from 'next-connect';

const searchEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any>) => {
    try{
        if(req.method === 'GET'){

            const { search } = req.query;
            
            if(!search || search.length< 2){
                return res.status(400).json({error: 'Insert a valid data'})
            }
            const result = await userModels
            .find({
                $or:[
                    {user: {
                        $regex: search,
                        $options: 'i'}},
                    {email: {
                        $regex: search,
                        $options: 'i'}},
                ]
            })
                return res.status(200).json({result})
            }
        return res.status(405).json({error: 'Invalid Method'})


    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Cannot search user'})
    }
}

export default tokenAuth(dbConnection(searchEndpoint))