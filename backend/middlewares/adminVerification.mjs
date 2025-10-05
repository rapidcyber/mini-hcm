import isVerifiedUser from "./tokenVerifation.mjs";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/database.mjs";
import createHttpError from "http-errors";

const isAdmin = async (req, res, next) => {
    try {
        await isVerifiedUser(req, res, async () => {
            const userId = req.user.user_id;

            const userDoc = await getDoc(doc(db, "users", userId));

            if (!userDoc.exists) {
                return next(createHttpError(404, "User not found"));
            }

            if (userDoc.data().role === false) {
                return next(createHttpError(403, "Access denied"));
            }

            next();
        });
    } catch (error) {
        next(error);
    }
}

export default isAdmin;