// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Upload a file directly to Firebase Storage with detailed console logging and error diagnostics.
 */
export async function uploadToFirebaseStorage(
  file: File | Blob,
  destinationPath: string,
  onProgress?: (percent: number, transferredBytes: number, totalBytes: number) => void
): Promise<{ downloadUrl: string; fullPath: string }> {
  console.log(`[Firebase Storage] Starting upload to path: "${destinationPath}" on bucket: "${firebaseConfig.storageBucket}"`);
  console.log(`[Firebase Storage] File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB, MIME type: ${file.type || 'unknown'}`);

  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log(`[Firebase Storage] Auth context: User is signed in as "${currentUser.email || currentUser.uid}"`);
  } else {
    console.warn(`[Firebase Storage] Auth context: No authenticated Firebase user. If storage.rules enforce 'request.auth != null', upload will fail with 'storage/unauthorized'.`);
  }

  const storageReference = ref(storage, destinationPath);
  const metadata = {
    contentType: file.type || 'application/octet-stream',
    customMetadata: {
      uploadedBy: currentUser?.email || 'Church Community Member',
      uploadedAt: new Date().toISOString(),
    },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageReference, file, metadata);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`[Firebase Storage] Progress: ${progress}% (${(snapshot.bytesTransferred / (1024 * 1024)).toFixed(1)} / ${(snapshot.totalBytes / (1024 * 1024)).toFixed(1)} MB) - State: ${snapshot.state}`);
        if (onProgress) {
          onProgress(progress, snapshot.bytesTransferred, snapshot.totalBytes);
        }
      },
      error => {
        console.error('[Firebase Storage] Upload Error encountered:', {
          code: error.code,
          message: error.message,
          serverResponse: error.serverResponse,
          bucket: firebaseConfig.storageBucket,
          path: destinationPath,
        });

        let userFacingError = '';
        switch (error.code) {
          case 'storage/unauthorized':
            userFacingError = `Firebase Storage अनुमति अस्वीकृत (storage/unauthorized): फ़ायरबेस स्टोरेज रूल्स ने अपलोड अस्वीकार कर दिया। कृपया सुनिश्चित करें कि आप लॉग इन हैं या स्टोरेज रूल्स 'allow write: if true;' पर सेट हैं।`;
            break;
          case 'storage/bucket-not-found':
            userFacingError = `Firebase Storage बकेट '${firebaseConfig.storageBucket}' नहीं मिली (storage/bucket-not-found). कृपया Firebase Console में स्टोरेज सक्रिय करें।`;
            break;
          case 'storage/quota-exceeded':
            userFacingError = `Firebase Storage कोटा समाप्त हो गया है (storage/quota-exceeded).`;
            break;
          case 'storage/retry-limit-exceeded':
            userFacingError = `Firebase Storage अपलोड टाइमआउट (storage/retry-limit-exceeded). कृपया इंटरनेट कनेक्शन जांचें।`;
            break;
          case 'storage/canceled':
            userFacingError = `Firebase Storage अपलोड रद्द कर दिया गया (storage/canceled).`;
            break;
          default:
            userFacingError = `Firebase Storage त्रुटि (${error.code || 'UNKNOWN'}): ${error.message || 'फ़ाइल अपलोड में समस्या आई।'}`;
        }

        const enrichedError: any = new Error(userFacingError);
        enrichedError.firebaseCode = error.code;
        enrichedError.originalMessage = error.message;
        reject(enrichedError);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`[Firebase Storage] Upload successful! Download URL:`, downloadUrl);
          resolve({
            downloadUrl,
            fullPath: uploadTask.snapshot.ref.fullPath,
          });
        } catch (urlErr: any) {
          console.error('[Firebase Storage] Failed to retrieve download URL:', urlErr);
          reject(new Error(`Download URL प्राप्त करने में विफल: ${urlErr.message}`));
        }
      }
    );
  });
}

// Helper for Google Sign In via Firebase Popup
export async function signInWithGooglePopup() {
  try {
    console.log('[Firebase Auth] Triggering Google Sign-In popup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[Firebase Auth] Google Sign-In success:', result.user.email);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('[Firebase Auth] Google Sign-In failed:', error.code, error.message);
    return { success: false, error: error.message || 'Google Sign-In was cancelled or failed.' };
  }
}

// Initialize Analytics conditionally when in supported browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('[Firebase Analytics] Initialized');
    }
  }).catch(() => {
    // Analytics not supported in some sandboxed iframes
  });
}

export default app;

