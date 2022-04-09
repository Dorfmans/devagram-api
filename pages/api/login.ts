/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";

export default (
    req: NextApiRequest,
    res: NextApiResponse) => {

    if(req.method === 'POST')
    {
        const {login, password} = req.body;

        if(login === 'admin@admin.com' &&
            password === 'admin0000')
            {
                res.status(200).json({msg: 'User confirmed'});
            }
        return res.status(400).json({error: 'Did you sign up?'});
    }
    return res.status(405).json({error: 'Method invalid'});
} 
