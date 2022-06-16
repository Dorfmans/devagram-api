import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { postModels } from '../../models/postModels'
import { userModels } from '../../models/userModels'
import { corsPolicy } from "../../middlewares/corsPolicy";

export const commentsEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
    try{
        if(req.method === 'PUT'){

            const {userId, id} = req.query;
            const loggedUser = await userModels.findById(userId);

            if(!loggedUser){
                return res.status(400).json({error: 'User not found'});
            }
            
            const post = await postModels.findById(id);
            
            if(!post){
                return res.status(400).json({error: 'Post not found'});
            }
            
            if(!req.body || !req.body.comments || req.body.comments.length < 2){
                return res.status(400).json({error: 'Invalid Comment'});
            }

            const comment = {
                userId: loggedUser._id,
                name: loggedUser.name,
                comment: req.body.comments
            };

            post.comments.push(comment);
            await postModels.findByIdAndUpdate({_id: post._id}, post)
            return res.status(200).json({message: 'Commented!'})

        }
        return res.status(405).json({error: 'Invalid Method'});
        
    }catch(e){
        console.log(e);
        return res.status(500).json({error: 'Cannot Post this Comment'});
    }
}

export default corsPolicy(tokenAuth(dbConnection(commentsEndpoint)));