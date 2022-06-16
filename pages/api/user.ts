import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';
import { dbConnection } from "../../middlewares/dbConnection";
import { userModels } from '../../models/userModels';
import nc from 'next-connect';
import { cosmicImageUploader, upload } from '../../services/cosmicImageUploader';
import { corsPolicy } from "../../middlewares/corsPolicy";

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<defaultMessage>) => {
        try{
            const { userId } = req?.query;
            const user = await userModels.findById(userId);
            
            if(!user){
                res.status(400).json({error: 'User not found'});
            }

            const { name } = req.body;
            if(name && name.length > 2){
                user.name = name;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await cosmicImageUploader(req);
                if(image && image.media && image.media.url){
                    user.avatar = image.media.url;
                }
            }
            await userModels.findByIdAndUpdate({_id: user._id}, user);

            res.status(200).json({message: 'User updated successfully'})

        }catch(e){
            console.log(e)
            return res.status(400).json({error: 'Cannot update user' + e})
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<defaultMessage | any>) => {
    
        try{
            const { userId } = req?.query;
            const user = await userModels.findById(userId);
            console.log('user', user)
            user.password = null;
            return res.status(200).json(user);
        }catch(e){
            console.log(e);
        }
        return res.status(400).json({error: 'Cannot find user data'});
        });

export const config = {
    api: {
        bodyParser: false
    }
}


export default  corsPolicy(tokenAuth(dbConnection(handler)));