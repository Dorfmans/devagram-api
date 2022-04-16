import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from '../../models/userModels';
import { postModels } from "../../models/postModels";
import { corsPolicy } from "../../middlewares/corsPolicy";

// import nc from 'next-connect';

export const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
    try{
        if(req.method === 'PUT'){
            
            const {id} = req?.query;
            const post = await postModels.findById(id);
            if(!post){
                return res.status(400).json({error: 'Post not found'})
            }
            const {userId} = req?.query;
            const user = await userModels.findById(userId);
            if(!user){
                return res.status(400).json({error: 'User not found'})
            }
            
            const userLikeIndex = post.likes.findIndex((e : any) => e.toString() === user._id.toString())
            
            if(userLikeIndex != -1){
                post.likes.splice(userLikeIndex, 1);
                await postModels.findByIdAndUpdate({_id: post._id}, post);
                return res.status(200).json({message: 'Disliked'});
            }
            else{
                post.likes.push(user._id);
                await postModels.findByIdAndUpdate({_id: post._id}, post);
                return res.status(200).json({message: 'Liked'});
            }
        }
        res.status(405).json({error: 'Invalid Method'})
    }catch(e){
        console.log(e)
        return res.status(500).json({error: 'Cannot like/dislike this post'})
    }
}

export default corsPolicy(tokenAuth(dbConnection(likeEndpoint)));