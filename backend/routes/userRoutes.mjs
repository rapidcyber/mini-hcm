import express from "express";
import { 
    getAllUsers, 
    getUserData, 
    updateUserData, 
    deleteUser, 
    register, 
    login,
    changePassword,
    logout 
} from "../controllers/UserController.mjs";
import isVerifiedUser from "../middlewares/tokenVerifation.mjs";
import isAdmin from "../middlewares/adminVerification.mjs";

const router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/change-password").patch(isVerifiedUser, changePassword);
// User Routes
router.route("/all").get(isVerifiedUser, getAllUsers);
router.route("/:id").get(isVerifiedUser, getUserData);
router.route("/:id").put(isVerifiedUser, updateUserData);
router.route("/:id").delete(isAdmin, deleteUser);

export default router;
