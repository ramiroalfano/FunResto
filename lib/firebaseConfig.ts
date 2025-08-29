import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD18P_ysxh44PZPT10xkfR0Ifq2BSMQh-Q",
  authDomain: "funfood-371b5.firebaseapp.com",
  projectId: "funfood-371b5",
  storageBucket: "funfood-371b5.appspot.com",
  messagingSenderId: "901586123943",
  appId: "1:901586123943:web:b10e1ae4b3b23527ed6f82",
  measurementId: "G-0S7HV74RFB",
  databaseURL: "https://funfood-371b5-default-rtdb.firebaseio.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
