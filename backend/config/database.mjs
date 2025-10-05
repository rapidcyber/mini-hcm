import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import config from './config.mjs';
import admin from 'firebase-admin';

const serviceAccountPath = config.firebaseAdminCredentialPath;

if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set.");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
});

export const db = getFirestore();
export const auth = getAuth();
export const adminAuth = admin.auth();
