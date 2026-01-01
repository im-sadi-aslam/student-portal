// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWX706MNF0cbDjL007N1oOpdGjOdXEzUM",
  authDomain: "mini-heckathon.firebaseapp.com",
  projectId: "mini-heckathon",
  storageBucket: "mini-heckathon.firebasestorage.app",
  messagingSenderId: "855474618398",
  appId: "1:855474618398:web:ad09d45b24d24fa1c92e0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;