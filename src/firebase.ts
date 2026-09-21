// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBFCNR3HYhftAtEpbWmamnEmh-kM9PlXw0",
  authDomain: "modified-primer-m6pck.firebaseapp.com",
  projectId: "modified-primer-m6pck",
  storageBucket: "modified-primer-m6pck.firebasestorage.app",
  messagingSenderId: "146077157091",
  appId: "1:146077157091:web:e22ec8bc63dd25b763a7d6",
  firestoreDatabaseId: "ai-studio-firegracefellows-d0f1cd0e-c594-41be-b1db-ef0604c14ee8"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);


// Initialize Analytics conditionally when in supported browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in some sandboxed iframes
  });
}

export default app;

