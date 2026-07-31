// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdurMGIYSPrBdhS2Q4yNjV0-KnO8p-CFE",
  authDomain: "labpulse-health.firebaseapp.com",
  databaseURL: "https://labpulse-health-default-rtdb.firebaseio.com",
  projectId: "labpulse-health",
  storageBucket: "labpulse-health.firebasestorage.app",
  messagingSenderId: "215495630178",
  appId: "1:215495630178:web:c0f494b60f342b7ede203b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);
const database = getDatabase(app);

// Export
export { auth, database };
console.log("Firebase Connected Successfully!");