import type { NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import { upload, cosmicImageUploader } from "../../services/cosmicImageUploader";
import { dbConnection } from "../../middlewares/dbConnection";
import { tokenAuth } from "../../middlewares/tokenAuth";
import { postModels } from "../../models/postModels";
import { userModels } from "../../models/userModels";
import nc from 'next-connect';
import { corsPolicy } from "../../middlewares/corsPolicy";


const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<defaultMessage>) => {
        
        try{

        const { userId } = req.query;
        const user = await userModels.findById(userId);

        if(!user){
            return res.status(400).json({error: 'User not found'})
        }

        if(!req || !req.body){
            return res.status(400).json({error: 'Missing fields'})
        }

        const {description} = req?.body;
        if(!description || description.length < 2){
            res.status(400).json({error: 'Invalid Description'});
        }

        if(!req.file || !req.file.originalname){
            res.status(400).json({error: 'Insert Image'});
        }

        const image = await cosmicImageUploader(req);
        const post = {
            idUser: user._id,
            description,
            image: image.media.url,
            date: new Date()
        }

        
        user.posts++
        await userModels.findByIdAndUpdate({_id: user._id}, user);
        
        await postModels.create(post);
        return res.status(200).json({message: 'Posted'});

        }catch(e){
            return res.status(400).json({error: 'Cannot post on feed'})
        }

    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default corsPolicy(tokenAuth(dbConnection(handler)));