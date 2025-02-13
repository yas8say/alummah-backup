// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuJwVHOyiQG6MZYH3S5zoZ2lVO6gLfMsA",
    authDomain: "al-ummah-app.firebaseapp.com",
    projectId: "al-ummah-app",
    storageBucket: "al-ummah-app.firebasestorage.app",
    messagingSenderId: "619580422153",
    appId: "1:619580422153:web:0af0d40a6719f898b160d8",
    measurementId: "G-2K4Z1S19T0"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { auth, signInWithPhoneNumber, RecaptchaVerifier };