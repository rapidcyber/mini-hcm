import { createUserWithEmailAndPassword } from "firebase/auth";
import { connectDB } from "../config/database.mjs";
import createHttpError from "http-errors";
import { getDoc, updateDoc } from "firebase/firestore";


const { db, auth, doc, setDoc, getDocs, serverTimestamp } = connectDB();

// Simple validators
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidTimezone = (tz) => typeof tz === "string" && tz.length > 0;
const isValidSchedule = (schedule) =>
  schedule &&
  typeof schedule.start === "string" &&
  typeof schedule.end === "string";

export const createUser = async (userData) => {
    try {
        const { name, email, password, role, phone, timezone, schedule } = userData;
        if (!name || !email || !password || !role || !phone || !timezone || !schedule) {
            throw new Error("All fields are required");
        }
        if (!isValidEmail(email)) {
            throw new Error("Invalid email format");
        }
        if (!isValidTimezone(timezone)) {
            throw new Error("Invalid timezone");
        }
        if (!isValidSchedule(schedule)) {
            throw new Error("Invalid schedule format");
        }

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Store additional user details in Firestore
        await setDoc(doc(db, "users", userId), {
            name,
            email,
            role,
            phone,
            timezone,
            schedule,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { message: "User created successfully", userId };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};


export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return createHttpError(404, 'User not found');
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return createHttpError(500, error.message);
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const userDoc = await updateDoc(doc(db, "users", userId), updatedData);
    console.log("User updated:", userDoc);
  } catch (error) {
    console.error("Error updating user:", error);
    return createHttpError(500, error.message);
  }
};

export const getUsers = async () => {
  try {
    const users = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}