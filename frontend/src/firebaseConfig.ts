import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd-eHy0qW9BmPlGdvbl35rydQS_MmKv8s",
  authDomain: "price-checker-app-34a47.firebaseapp.com",
  projectId: "price-checker-app-34a47",
  storageBucket: "price-checker-app-34a47.appspot.com",
  messagingSenderId: "1083427229045",
  appId: "1:1083427229045:web:667c6209c99cfc51ee973c",
  measurementId: "G-0TJ7ZQH09F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
