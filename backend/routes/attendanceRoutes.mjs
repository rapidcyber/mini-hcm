import express from "express";
// import isVerifiedUser from "../middlewares/tokenVerifation.mjs";
import {
  markAttendance,
  getAttendance,
  updateAttendance,
  getAllAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.mjs";
import isAdmin from "../middlewares/adminVerification.mjs";

const router = express.Router();

// Attendance Routes
router.route("/mark").post( markAttendance);
router.route("/all").get( getAllAttendance);
router.route("/:id").get( getAttendance);
router.route("/:id").put( updateAttendance).delete( deleteAttendance);
router.route("/delete/:id").delete(isAdmin,deleteAttendance);

export default router;