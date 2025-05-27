
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration!
const firebaseConfig = {
  apiKey: "AIzaSyA_aLcWdhJFUC_AexgpqZa44dyAz-q0ueg",
  authDomain: "real-estate-cameroon-924d3.firebaseapp.com",
  projectId: "real-estate-cameroon-924d3",
  storageBucket: "real-estate-cameroon-924d3.firebasestorage.app",
  messagingSenderId: "315893613776",
  appId: "1:315893613776:web:063218ae7b7d9faea58ad5",
  measurementId: "G-TTG1208PG6"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
