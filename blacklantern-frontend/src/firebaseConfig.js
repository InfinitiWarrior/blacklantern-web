// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlmCiyIbfi2lHqt_WJgyg7oaxWSZNikHU",
  authDomain: "blacklantern-9b622.firebaseapp.com",
  projectId: "blacklantern-9b622",
  storageBucket: "blacklantern-9b622.firebasestorage.app",
  messagingSenderId: "361349262757",
  appId: "1:361349262757:web:0add2fa293d6644042cc4c",
  measurementId: "G-48PNRLR1JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export the services you plan to use
export { auth, db, storage, analytics };
