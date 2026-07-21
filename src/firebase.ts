import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmMhvwOFubr0J2bHbxZbc_WIwQXFdmKzg",
  authDomain: "concise-alpha-86pck.firebaseapp.com",
  projectId: "concise-alpha-86pck",
  storageBucket: "concise-alpha-86pck.firebasestorage.app",
  messagingSenderId: "294224953541",
  appId: "1:294224953541:web:e6a02eba9321488d2170ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-16e03847-4c04-4794-b962-5e698f82dbb0");
export const storage = getStorage(app);
