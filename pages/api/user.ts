import type { NextApiRequest, NextApiResponse } from "next";
import type { defaultMessage } from "../../types/defaultMessage";
import {tokenAuth} from '../../middlewares/tokenAuth';

const userEndpoint = (req: NextApiRequest, res: NextApiResponse<defaultMessage>) => {
    return res.status(200).json({message: 'User Successfully Authenticated'});
}

export default  tokenAuth(userEndpoint);