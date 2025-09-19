import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

// Lee las variables de entorno de Next.js (NEXT_PUBLIC_)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Verifica que todas las variables de entorno necesarias estén presentes
if (Object.values(firebaseConfig).some(value => !value)) {
  console.error("Faltan variables de entorno de Firebase. Asegúrate de que tu archivo .env.local esté configurado correctamente.");
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configurar la persistencia de la sesión
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error al configurar la persistencia de Firebase:", error);
  });

export { app, db, auth, googleProvider };
