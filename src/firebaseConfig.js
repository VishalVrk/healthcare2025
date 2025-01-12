import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDw7i_jwvaUCM2f0oj_g4jYnjgLFOMQv6o",
    authDomain: "healthcare2025-ec668.firebaseapp.com",
    projectId: "healthcare2025-ec668",
    storageBucket: "healthcare2025-ec668.firebasestorage.app",
    messagingSenderId: "234958159774",
    appId: "1:234958159774:web:8a47830467632a38ce608f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);