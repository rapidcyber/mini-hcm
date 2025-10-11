import dotenv from "dotenv";
import { initializeApp } from 'firebase/app';
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_ADMIN_CREDENTIAL_PATH
);

const app = initializeApp(firebaseConfig);

if ( app ) {
  console.log("☑️  Firebase initialized");
}

const config = {
  app: app,
  port: process.env.PORT || 5000,
  accessTokenSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  firebaseAdminCredentialPath: serviceAccountPath,
};

export default config;