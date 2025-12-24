// Run this script once to create the initial admin user in Firestore
// Usage: node scripts/setup-admin.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA3aoCZjaArgqRLkT_i_iRDVndSevxQq7M",
    authDomain: "website-fujipp.firebaseapp.com",
    projectId: "website-fujipp",
    storageBucket: "website-fujipp.firebasestorage.app",
    messagingSenderId: "748336475196",
    appId: "1:748336475196:web:46cd0d4de30ea454b5e739"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupAdmin() {
    try {
        // Add admin user
        await setDoc(doc(db, 'admins', 'admin1'), {
            userId: 'Fujipp',
            password: 'FUJIPP_Fujipp_2003@00'
        });

        console.log('✅ Admin user created successfully!');
        console.log('📋 Credentials:');
        console.log('   User ID: Fujipp');
        console.log('   Password: FUJIPP_Fujipp_2003@00');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

setupAdmin();
