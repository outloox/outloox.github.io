
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration - THIS IS PUBLIC AND SAFE
const firebaseConfig = {
  projectId: "new-prototype-nwxqu",
  appId: "1:566429311781:web:0e519ebb825211d131f0cc",
  storageBucket: "new-prototype-nwxqu.appspot.com",
  apiKey: "AIzaSyDU-1IcfrQ5D_-p8Sd_-1ysByR70Yb4Yto",
  authDomain: "new-prototype-nwxqu.firebaseapp.com",
  measurementId: "",
  databaseURL: "https://new-prototype-nwxqu-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
