import express, { Router } from "express";
import isVerifiedUser from "../middlewares/tokenVerifation.mjs";
import {
  markAttendance,
  getAttendance,
  updateAttendance,
  getAllAttendance,
  deleteAttendance,
  getMyAttendance

} from "../controllers/attendanceController.mjs";
import isAdmin from "../middlewares/adminVerification.mjs";

const router = express.Router();

// Attendance Routes
router.route("/mark").post( isVerifiedUser, markAttendance);
router.route("/all").get( isVerifiedUser, getAllAttendance);
router.route("/:id").get( isVerifiedUser, getAttendance);
router.route("/:id").put( isAdmin,updateAttendance);
router.route("/me/all").get(isVerifiedUser,getMyAttendance);
router.route("/delete/:id").delete(isAdmin,deleteAttendance);

export default router;