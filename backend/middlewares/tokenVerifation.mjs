import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import config from "../config/config.mjs";
import { getUser} from "../models/userModel.mjs";

const isVerifiedUser = async (req, res, next) => {
    try {
        const {accessToken} = req.cookies;

        if (!accessToken) {
            const error = createHttpError(401, 'Please provide token');
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);
        const user = await getUser(decodeToken._id);

        if(!user){
            const error = createHttpError(401, 'User not exist!');
            return next(error);
        }

        req.user = user;
        next();

    } catch (error) {
        const err = createHttpError(401, 'Invalid Token');
        next(err);
    }
}

export default isVerifiedUser;