import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA3aoCZjaArgqRLkT_i_iRDVndSevxQq7M",
    authDomain: "website-fujipp.firebaseapp.com",
    projectId: "website-fujipp",
    storageBucket: "website-fujipp.firebasestorage.app",
    messagingSenderId: "748336475196",
    appId: "1:748336475196:web:46cd0d4de30ea454b5e739",
    measurementId: "G-M0PDRW2YT1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
