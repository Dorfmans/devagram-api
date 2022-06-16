import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { postModels } from '../../models/postModels'
import { userModels } from '../../models/userModels'
import { followingModels } from "../../models/followingModels";
import { corsPolicy } from "../../middlewares/corsPolicy";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any>) => {
    
    try{

        if(req.method === 'GET'){
            if(req?.query?.id){
                const user = await userModels.findById(req?.query?.id);

                if(!user){
                    return res.status(400).json({error: 'User not found'});
                }

                const posts = await postModels
                .find({idUser: user._id})
                .sort({date: -1});

                return res.status(200).json({posts});
            }else{
                const {userId} = req.query;
                const loggedUser = await userModels.findById(userId);
                if(!loggedUser){
                    return res.status(400).json({error: 'User not found'});
                }
                const followers = await followingModels.find({userId: loggedUser._id});
                const followersId = followers.map(f => f.followingUserId);
                const posts = await postModels
                .find({
                    $or: [    
                        {idUser: loggedUser._id},
                        {idUser: followersId }]})
                .sort({date: -1});

                const result = [];
                for (const post of posts){
                    const postUser = await userModels.findById(post.idUser);
                    if(postUser){
                        const finalPost =
                        {...post._doc,
                            user : {
                                name: postUser.name,
                                avatar: postUser.avatar
                        }};
                        result.push(finalPost)
                    }
                }
                return res.status(200).json(result);
            }
        }
        return res.status(405).json({error: 'Invalid Method'});
    }catch(e){
        console.log(e);
    }
        return res.status(400).json({error: 'Cannot get feed'})
}

export default corsPolicy(tokenAuth(dbConnection(feedEndpoint)));