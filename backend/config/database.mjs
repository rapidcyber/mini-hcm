import config from "./config.mjs";
import { getFirestore, doc, updateDoc, deleteDoc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";


export const connectDB = () => {
    try {
        const db = getFirestore(config);
        const auth = getAuth(config);
        console.log("Firebase connected");
        return {
          db,
          auth,
          doc,
          setDoc,
          updateDoc,
          deleteDoc,
          collection,
          getDocs,
          serverTimestamp,
        };
    } catch (error) {
        console.log("Firebase connection error", error);
        process.exit(1);
    }
}

export default connectDB;
