import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from '../../models/userModels';
import { corsPolicy } from "../../middlewares/corsPolicy";
import { followingModels } from "../../models/followingModels";
// import nc from 'next-connect';

const searchEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any[]>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const result = await userModels.findById(req?.query?.id);
                if(!result){
                    return res.status(400).json({error: 'User not found'});
                }

                const user = {
                    password: null,
                    followThisUser: false,
                    name: result.name,
                    email: result.email,
                    _id: result._id,
                    avatar: result.avatar,
                    followers: result.followers,
                    following: result.following,
                    posts: result.posts
                } as any;

                const followThisUser = await followingModels.find({userIds: req?.query?.userId, followingUserId: result._id});
                if (followThisUser && followThisUser.length > 0) {
                    user.followThisUser = true;
                }
                return res.status(200).json(user);}
            else{
                const { search } = req.query;

            if(!search || search.length< 2){
                return res.status(400).json({error: 'Insert a valid data'});
            }
            
            const result = await userModels
            .find({
                $or:[
                    {name: {
                        $regex: search,
                        $options: 'i'}},
                    // {email: {
                    //     $regex: search,
                    //     $options: 'i'}},
                ]
            });
            result.forEach(uf => {uf.password = null});
            return res.status(200).json(result);
            }}

        return res.status(405).json({error: 'Invalid Method'});
    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Cannot search user'});
    }
}

export default corsPolicy(tokenAuth(dbConnection(searchEndpoint)));