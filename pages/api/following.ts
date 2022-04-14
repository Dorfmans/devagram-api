import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from "../../models/userModels";
import { followingModels } from "../../models/followingModels";



export const followingEndpoint = async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
    try{
        if(req.method === 'PUT'){

            const {userId, id} = req?.query;
            const loggedUser = await userModels.findById(userId);
            const followingUser = await userModels.findById(id);

            if(!loggedUser){
                return res.status(400).json({error: 'Logged User not found'});
            }

            if(!followingUser){
                return res.status(400).json({error: 'Following User not found'});
            }

            const isFollowing = await followingModels.find({userId: loggedUser._id, followingUserId: followingUser._id});
            if(isFollowing && isFollowing.length > 0){

                isFollowing.forEach(async (e: any) => await followingModels.findByIdAndDelete({_id: e._id}));

                loggedUser.followings--;
                await userModels.findByIdAndUpdate({_id: loggedUser._id}, loggedUser);

                followingUser.followers--;
                await userModels.findByIdAndUpdate({_id: followingUser._id}, followingUser);


                res.status(200).json({message: 'Unfollowing!'})

            }else{
                const following = {
                    userId: loggedUser._id,
                    followingUserId: followingUser._id
                };

            await followingModels.create(following);

            loggedUser.followings++;
            await userModels.findByIdAndUpdate({_id: loggedUser._id}, loggedUser);

            followingUser.followers++;
            await userModels.findByIdAndUpdate({_id: followingUser._id}, followingUser);


            return res.status(200).json({message: 'Following!'})
            }

        }

    return res.status(405).json({error: 'Invalid Method'});

    }catch(e){
        console.log(e);
        return res.status(500).json({error: 'Cannot follow/unfollow this user'});
    }
}

export default tokenAuth(dbConnection(followingEndpoint));