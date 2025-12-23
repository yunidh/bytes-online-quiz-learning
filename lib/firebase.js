// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNvaO-CmQ9vgAm-HzobMhd1u5sxJjJSYI",
  authDomain: "intrinsic-learning.firebaseapp.com",
  databaseURL:
    "https://intrinsic-learning-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "intrinsic-learning",
  storageBucket: "intrinsic-learning.firebasestorage.app",
  messagingSenderId: "238160435268",
  appId: "1:238160435268:web:84e5e21558abcdadcb8411",
  measurementId: "G-EZ1YMZ6C23",
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with error handling
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
