// userController.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { connectDB  } from "../config/database.mjs";
import { createUser, getUser, updateUser, getUsers } from "../models/userModel.mjs";

const { db, auth, doc, deleteDoc, getDocs, setDoc, serverTimestamp, getDoc, updateDoc } = connectDB();
export const register = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Save user data in Firestore
    await createUser(userId, userData);
    console.log("User registered and data saved!");
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = await getUser(userId);
    res.status(200).json({ data: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    next(error);
  }
};

export const updateUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // const user = await updateUser(userId, updatedData);
    // console.log(user);
    // res.status(200).json({ message: "User data updated!", data: user });
    res.status(200).json({ id: userId, data: updatedData });
  } catch (error) {
    console.error("Error updating user data:", error);
    next(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User deleted!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const logoutUser = (req, res) => {   
  res.clearCookie("accessToken");
  res.status(200).json({ message: "User logged out successfully" });
};

export const getAllUsers = async (res, next) => {
  try {
    const usersList = [];
    const querySnapshot = await getUsers();
    querySnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(usersList);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          const error = createHttpError(400, 'Email and Password are required');
          return next(error);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const user = await getUser(userId);

      if (!user) {
          const error = createHttpError(404, 'User not found');
          return next(error);
      }

      // Generate JWT token
      const accessToken = jwt.sign(
          { _id: userId, email: user.email, role: user.role },
          config.accessTokenSecret,
          { expiresIn: '1h' }
      );

      // Set token in HTTP-only cookie
      res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000 // 1 hour
      });

      res.status(200).json({ message: 'Login successful', user: { id: userId, ...user
      } });
  } catch (error) {
      const err = createHttpError(401, 'Invalid Credentials');
      next(err);
  }
};

export const logout = (req, res) => {   
  res.clearCookie("accessToken");
  res.status(200).json({ message: "User logged out successfully" });
};