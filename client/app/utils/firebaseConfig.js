// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcmLga6zMNnvkVKQpXFEps4mO9SCCn7Pg",
  authDomain: "nextjsexpress.firebaseapp.com",
  projectId: "nextjsexpress",
  storageBucket: "nextjsexpress.firebasestorage.app",
  messagingSenderId: "509895694806",
  appId: "1:509895694806:web:b59c5c4165d926b6beec77",
  measurementId: "G-6HBMN28LDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics};