// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyJNkZgYEjAUmIb4YDuBhpR3MDhfWH2Wo",
  authDomain: "netflixgpt-3cc18.firebaseapp.com",
  projectId: "netflixgpt-3cc18",
  storageBucket: "netflixgpt-3cc18.appspot.com",
  messagingSenderId: "858227287891",
  appId: "1:858227287891:web:3d4c844e1162883a19a3a6",
  measurementId: "G-Y4YT0F7SW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()