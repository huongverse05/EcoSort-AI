import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgFndURiR51uhOUJ1698avbC5i4o4Mc1s",
  authDomain: "waste-detection-1868e.firebaseapp.com",
  projectId: "waste-detection-1868e",
  storageBucket: "waste-detection-1868e.firebasestorage.app",
  messagingSenderId: "434696191414",
  appId: "1:434696191414:web:3f35acd1c5a601482d5517",
  measurementId: "G-0JHFDHZCE7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);