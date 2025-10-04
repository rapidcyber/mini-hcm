import express from "express";
import isVerifiedUser from "../middlewares/tokenVerifation.mjs";
import {
  register,
  login,
  getUserData,
  getAllUsers,
  logout,
  updateUserData,
  deleteUser,
} from "../controllers/UserController.mjs";

const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);

// User Routes
router.route("/all").get(isVerifiedUser, getAllUsers);
router.route("/:id").get(getUserData);
router.route("/:id").put(updateUserData);
router.route("/:id").delete(isVerifiedUser, deleteUser);

export default router;
