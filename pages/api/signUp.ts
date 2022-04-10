import type { NextApiRequest, NextApiResponse } from 'next';
import type { signUpTypes } from '../../types/signUpTypes';
import type { defaultMessage } from '../../types/defaultMessage';
import { userModels } from '../../models/userModels';
import { dbConnection } from '../../middlewares/dbConnection'
import md5 from 'md5';

const endpointSignUp =
    async (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
        if(req.method === 'POST'){
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
            
            
            const savingUser = {
                user: user.user,
                email: user.email,
                password: md5(user.password)
            }
            
            
            const sameUserEmail = await userModels.find({email : user.email});
            if(sameUserEmail && sameUserEmail.length > 0)
            {return res.status(400).json({error: 'Email already signed up'})};
            
            await userModels.create(savingUser);
            return res.status(201).json({message: 'User Created'})
            };
        return res.status(405).json({error: 'Invalid Method'})
        }

        export default dbConnection(endpointSignUp)