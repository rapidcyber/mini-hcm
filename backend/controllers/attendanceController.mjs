import { db } from "../config/database.mjs";
import { doc, query, where, addDoc, deleteDoc, serverTimestamp, getDocs, getDoc, collection, updateDoc } from "firebase/firestore";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";


export const markAttendance = async (req, res, next) => {
  try {
    const { userId, timestamp, type } = req.body;

    const userRef = doc(db, "users", userId);
    
    await addDoc(collection(db, "attendance"), {
      userId: userRef,
      type,
      timestamp: timestamp || serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const id = req.params.id;
    
  const attendanceDoc = await getDoc(doc(db, "attendance", id));

    if (!attendanceDoc.exists) {
      return next(createHttpError(404, "Attendance record not found"));
    }

    res.status(200).json({ data: attendanceDoc.data() });

  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (req, res, next) => {
  try {
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    const attendanceRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ data: attendanceRecords });
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { type, timestamp } = req.body;

    const attendanceRef = doc(db, "attendance", id);
    
    await updateDoc(attendanceRef, {
      type,
      timestamp: timestamp ? new Date(timestamp) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllAttendanceByUserId = async (req, res, next) => {
  try {
    const {accessToken} = req.cookies;
    const decoded = jwt.decode(accessToken);
    const userId = decoded.user_id;

    const q = query(collection(db, "attendance"), where("userId", "==", userId));
    const attendanceSnapshot = await getDocs(q);
    const attendanceRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ data: attendanceRecords });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const id = req.params.id;

    await deleteDoc(doc(db, "attendance", id));

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};