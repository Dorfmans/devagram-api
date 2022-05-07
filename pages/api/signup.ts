import type { NextApiRequest, NextApiResponse } from 'next';
import type { signUpTypes } from '../../types/signUpTypes';
import type { defaultMessage } from '../../types/defaultMessage';
import { userModels } from '../../models/userModels';
import { dbConnection } from '../../middlewares/dbConnection'
import md5 from 'md5';
import { upload, cosmicImageUploader } from '../../services/cosmicImageUploader';
import nc from 'next-connect';
import { corsPolicy } from '../../middlewares/corsPolicy';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {

        try{

        const user = req.body as signUpTypes;

        if(!user.user || user.user.length < 2)
        {return res.status(400).json({error: 'Invalid Username'})};

        if(!user.email 
        || user.email.length < 5 
        || !user.email.includes('@') 
        || !user.email.includes('.'))
        {return res.status(400).json({error: 'Invalid Email'})};

        if(!user.password || user.password.length < 4)
        {return res.status(400).json({error: 'Invalid Password'})};

        const image = await cosmicImageUploader(req);


        const savingUser = {
        user: user.user,
        email: user.email,
        password: md5(user.password),
        avatar: image?.media?.url
        }

        const sameUserEmail = await userModels.find({email : user.email});
        if(sameUserEmail && sameUserEmail.length > 0)
        {return res.status(400).json({error: 'Email already signed up'})};

        await userModels.create(savingUser);
        return res.status(201).json({message: 'User Created'})

        }catch(e : any){
            console.log(e)
            return res.status(400).json({error: e.toString()})
        };}
    );

export const config = {
    api: {
        bodyParser: false
    }
}

export default corsPolicy(dbConnection(handler));
