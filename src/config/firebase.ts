import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCHtswJkJdK7BO0sSOs8U9ZpHUlhoDPY-U",
    authDomain: "linear-budgeting.firebaseapp.com",
    projectId: "linear-budgeting",
    storageBucket: "linear-budgeting.firebasestorage.app",
    messagingSenderId: "240460909695",
    appId: "1:240460909695:web:d3f4a2693e0912dc88434a",
    measurementId: "G-WXJSQ0VDQC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
