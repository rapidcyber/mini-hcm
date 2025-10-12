import { db } from "../config/database.mjs";
import {
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  collection,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";


export const markAttendance = async (req, res, next) => {
  try {
    const { timestamp, type } = req.body;

    const accessToken = req.cookies.accessToken;

    const decoded = jwt.decode(accessToken);
    const userId = decoded.user_id;

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

export const getMyAttendance = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decoded = jwt.decode(accessToken);
    const userId = decoded.user_id;

    const q = query(collection(db, "attendance"), where("userId", "==", doc(db, "users", userId)));
    const snapshot = await getDocs(q);

    const attendanceRecords = snapshot.docs.map(doc => ({ id: doc.id, timestamp: doc.data().timestamp.toDate(), type: doc.data().type, createdAt: doc.data().createdAt.toDate(), updatedAt: doc.data().updatedAt.toDate() }));

    res
      .status(200)
      .json({
        data: attendanceRecords ? attendanceRecords.sort((a, b) => b.timestamp - a.timestamp) : [],
      });
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
    const attendanceRecords = attendanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId.id,
      type: doc.data().type,
      timestamp: doc.data().timestamp.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));

    res.status(200).json({ data: attendanceRecords.sort((a, b) => b.timestamp - a.timestamp) });
  } catch (error) {
    next(error);
  }
};

export const getPunchesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", doc(db, "users", userId))
    );
    return getDocs(q).then((snapshot) => {
      const attendanceRecords = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type,
        timestamp: doc.data().timestamp.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));
      res.status(200).json({ data: attendanceRecords });
    });
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

    res.status(200).json({ message: "Attendance updated successfully", data: { id, type, timestamp } });
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
