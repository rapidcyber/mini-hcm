import createHttpError from "http-errors";
import Attendance from "../models/attendanceModel.mjs";
import config from "../config/config.mjs";

export const markAttendance = async (req, res, next) => {
  try {
    const { userId, type } = req.body;

    if (!userId || !type) {
      throw createHttpError(400, "User ID and type are required");
    }

    const result = await Attendance.recordAttendance(userId, type);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw createHttpError(400, "User ID is required");
    }

    const attendance = await Attendance.fetchAttendanceByUserId(userId);
    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (req, res, next) => {
  try {
    const attendanceList = await Attendance.fetchAllAttendance();
    res.status(200).json(attendanceList);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, timestamp } = req.body;

    if (!id) {
      throw createHttpError(400, "Attendance ID is required");
    }

    const result = await Attendance.modifyAttendance(id, { type, timestamp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createHttpError(400, "Attendance ID is required");
    }

    const result = await Attendance.removeAttendance(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};