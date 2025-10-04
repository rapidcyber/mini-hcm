import { createUserWithEmailAndPassword } from "firebase/auth";
import { connectDB } from "../config/database.mjs";

const { db, auth, doc, setDoc, serverTimestamp, getDoc, updateDoc } = connectDB();
import { getDocs, collection, deleteDoc } from "firebase/firestore";
const attendanceCollection = "attendance";

const isValidType = (type) => type === "check-in" || type === "check-out";
const isValidTimestamp = (timestamp) =>
  timestamp instanceof Date && !isNaN(timestamp);



export const recordAttendance = async (userId, type) => {
  try {
    if (!userId || !type || !isValidType(type)) {
      throw new Error("Invalid parameters");
    }

    if (!isValidTimestamp(timestamp)) {
      throw new Error("Invalid timestamp");
    }

    if (type === "check-in") {
      // Check if user has already checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const attendanceDoc = await getDoc(doc(db, attendanceCollection, userId));
      if (attendanceDoc.exists()) {
        const attendanceData = attendanceDoc.data();
        const lastCheckIn = attendanceData.timestamp.toDate();
        lastCheckIn.setHours(0, 0, 0, 0);
        if (lastCheckIn.getTime() === today.getTime()) {
          throw new Error("User has already checked in today");
        }
      }
    }

    const timestamp = serverTimestamp();
    await setDoc(doc(db, attendanceCollection, userId), {
      userId,
      type,
      timestamp,
    });

    return { message: "Attendance recorded successfully" };
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
};

export const getAttendance = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const attendanceDoc = await getDoc(doc(db, attendanceCollection, userId));
    if (attendanceDoc.exists()) {
      return attendanceDoc.data();
    } else {
      throw new Error("No attendance record found for this user");
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
};

export const getAllAttendance = async () => {
  try {
    const attendanceList = [];
    const querySnapshot = await getDocs(collection(db, attendanceCollection));
    querySnapshot.forEach((doc) => {
      attendanceList.push(doc.data());
    });
    return attendanceList;
  } catch (error) {
    console.error("Error fetching all attendance records:", error);
    throw error;
  }
};

export const updateAttendance = async (id, updatedData) => {
  try {
    if (!id || !updatedData) {
      throw new Error("Invalid parameters");
    }

    if (updatedData.type && !isValidType(updatedData.type)) {
      throw new Error("Invalid attendance type");
    }

    if (updatedData.timestamp && !isValidTimestamp(updatedData.timestamp)) {
      throw new Error("Invalid timestamp");
    }

    updatedData.updatedAt = serverTimestamp();
    await updateDoc(doc(db, attendanceCollection, id), updatedData);

    return { message: "Attendance updated successfully" };
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

export const deleteAttendance = async (id) => {
  try {
    if (!id) {
      throw new Error("Attendance ID is required");
    }

    await deleteDoc(doc(db, attendanceCollection, id));
    return { message: "Attendance record deleted successfully" };
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    throw error;
  }
};

const Attendance = {
  recordAttendance,
  getAttendance,
  updateAttendance,
  getAllAttendance,
  deleteAttendance,
};

export default Attendance;