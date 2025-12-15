// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1XmpUmskTFXyDddadohlW7l3Q3eRid6w",
  authDomain: "vibe-74019.firebaseapp.com",
  projectId: "vibe-74019",
  storageBucket: "vibe-74019.firebasestorage.app",
  messagingSenderId: "286378735290",
  appId: "1:286378735290:web:8c35c7506405822ac1f483",
  measurementId: "G-6ZWGPXKTGN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();