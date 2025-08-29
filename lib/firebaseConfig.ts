import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Prefer NEXT_PUBLIC_ (Next.js) but also accept REACT_APP_ keys if present.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD18P_ysxh44PZPT10xkfR0Ifq2BSMQh-Q",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "funfood-371b5.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || "funfood-371b5",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "funfood-371b5.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "901586123943",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || "1:901586123943:web:b10e1ae4b3b23527ed6f82",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-0S7HV74RFB",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://funfood-371b5-default-rtdb.firebaseio.com",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
