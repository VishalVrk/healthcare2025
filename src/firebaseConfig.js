import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC4cgroHnb_WrnXAd_iMR8T4OsZNFrvj8w",
  authDomain: "healthcare-54b85.firebaseapp.com",
  databaseURL: "https://healthcare-54b85-default-rtdb.firebaseio.com",
  projectId: "healthcare-54b85",
  storageBucket: "healthcare-54b85.appspot.com",
  messagingSenderId: "349262987127",
  appId: "1:349262987127:web:0c3a95e534d202661aab72",
  measurementId: "G-3XSRJLGRLK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);