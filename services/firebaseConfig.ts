import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ===== Your Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyBdSjCrDGrOg7XllNUSCU5uTEQA8_ZRHlo",
  authDomain: "techreach-42ae3.firebaseapp.com",
  projectId: "techreach-42ae3",
  storageBucket: "techreach-42ae3.firebasestorage.app",
  messagingSenderId: "203032606282",
  appId: "1:203032606282:web:8ccb26aaf90407872dd8b3",
  measurementId: "G-2PXVGTQGVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);