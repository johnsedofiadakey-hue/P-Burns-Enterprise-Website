import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1wO6sb5ovqIUQTawbjSavmCj9cxKUkBc",
  authDomain: "p-burnsenterprise.firebaseapp.com",
  projectId: "p-burnsenterprise",
  storageBucket: "p-burnsenterprise.firebasestorage.app",
  messagingSenderId: "454266295285",
  appId: "1:454266295285:web:ca133fcf1fc00d467ec6bc"
};

// Initialize Firebase (prevent duplicate initialization in Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
