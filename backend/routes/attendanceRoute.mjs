import express from "express";
import isVerifiedUser from "../middlewares/tokenVerifation.mjs";
import {
  markAttendance,
  getAttendance,
  updateAttendance,
  getAllAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.mjs";

const router = express.Router();

// Attendance Routes
router.route("/mark").post(isVerifiedUser, markAttendance);
router.route("/").get(isVerifiedUser, getAttendance);
router.route("/all").get(isVerifiedUser, getAllAttendance);
router.route("/:id").put(isVerifiedUser, updateAttendance).delete(isVerifiedUser, deleteAttendance);
router.route("/delete/:id").delete(isVerifiedUser, deleteAttendance);

export default router;