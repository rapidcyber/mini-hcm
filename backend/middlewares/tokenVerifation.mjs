import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const isVerifiedUser = async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) return next(createHttpError(401, "Missing token"));

      const decoded = jwt.decode(token); // no signature verification

      if (!decoded || !decoded.user_id) return next(createHttpError(401, "Invalid token"));

      req.user = decoded;
      next();
    } catch (error) {
        next(error);
    }
}

export default isVerifiedUser;