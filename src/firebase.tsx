import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "tattletale-17daf.firebaseapp.com",
    projectId: "tattletale-17daf",
    storageBucket: "tattletale-17daf.appspot.com",
    messagingSenderId: "315494650097",
    appId: "1:315494650097:web:f0280018ff851e2a1b1950"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);