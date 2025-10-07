import { db, auth, adminAuth } from "../config/database.mjs";
import { doc, setDoc, serverTimestamp, getDocs, collection, updateDoc, getDoc, deleteDoc, where, query } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, timezone, schedule } = req.body;

    const userRecord = await createUserWithEmailAndPassword(auth, email, password);

    const userData = await setDoc(doc(db, "users", userRecord.user.uid), {
      name,
      email,
      role,
      timezone,
      schedule,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const userRecord = await signInWithEmailAndPassword(auth, email, password);

    const accessToken = await userRecord.user.getIdToken();

    if (!accessToken) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    const user = {
      id: userRecord.user.uid,
      email: userRecord.user.email,
    };

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      accessToken,
    });
  } catch (error) {
    next(createHttpError(401, "Invalid email or password"));
  }
};
export const getUserData = async (req, res, next) => {
  try {
    
    const {accessToken} = req.cookies;
    const decoded = jwt.decode(accessToken);
    const userId = decoded.user_id;
    
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists) {
      return next(createHttpError(404, "User not found"));
    }
    const data = userDoc.data();
    const userData = {
      id: userId,
      name: data.name,
      email: data.email,
      role: data.role,
      timezone: data.timezone,
      schedule: data.schedule,
    };

    res.status(200).json({ data: userData });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json({ data: userDoc.data() });
  } catch (error) {
    next(error);
  }
};


export const updateUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userData = req.body;
    const updatedUserData = await updateDoc(doc(db, "users", userId), {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    res.status(200).json({ message: "User updated successfully", user: updatedUserData });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    await signOut(auth);
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    const q = query(collection(db, "attendance"), where("userId", "==", userRef));
    const snapshot = await getDocs(q);

    const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletions);    

    if (!userDoc.exists) {
      return next(createHttpError(404, "User not found"));
    }

    await deleteDoc(doc(db, "users", userId));
    await adminAuth.deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export const changePassword = async (req, res, next) => {
  try {

    const accessToken = req.cookies.accessToken;
    if (!accessToken) return next(createHttpError(401, "Missing token"));

    const decoded = jwt.decode(accessToken); // no signature verification
    if (!decoded || !decoded.user_id) return next(createHttpError(401, "Invalid token"));

    const userId = decoded.user_id;
    const { password } = req.body;

    auth.signOut();

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    await adminAuth.updateUser(userId, { password: password });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
}