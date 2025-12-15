// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);