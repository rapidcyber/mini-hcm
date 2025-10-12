import { auth, db } from "./config/database.mjs";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import createHttpError from "http-errors";

const adminData = {
    email: "user@mini-hcm.com",
    password: "password",
    schedule: {
        start: "09:00",
        end: "18:00"
    },
    timezone: "Asia/Manila",
    name: "Administrator",
    role: true

}

try {
    const userRecord = await createUserWithEmailAndPassword(
      auth,
      adminData.email,
      adminData.password
    );
    const userData = await setDoc(doc(db, "users", userRecord.user.uid), {
          name: adminData.name,
          email: adminData.email,
          role: true,
          timezone : adminData.timezone,
          schedule : adminData.schedule,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
    console.log("Admin created successfully");
    return;
} catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
}