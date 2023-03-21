import { initializeApp } from "firebase/app";
import { } from 'firebase/auth';
import { } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7YoKjnhagQ-5HVUNA1zs0EMz2AD-PYbY",
  authDomain: "recipe-tracker-f4d4e.firebaseapp.com",
  projectId: "recipe-tracker-f4d4e",
  storageBucket: "recipe-tracker-f4d4e.appspot.com",
  messagingSenderId: "734970261321",
  appId: "1:734970261321:web:2ba2de648365bf5588f498",
  measurementId: "G-69Y79CZLFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);