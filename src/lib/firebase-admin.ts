import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];
  
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (privateKey && process.env.FIREBASE_CLIENT_EMAIL) {
    return initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'p-burnsenterprise',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: 'p-burnsenterprise.firebasestorage.app',
    });
  }
  
  // Use Application Default Credentials (ADC) in App Hosting / GCP
  return initializeApp({
    storageBucket: 'p-burnsenterprise.firebasestorage.app',
  });
}

export function getAdminDb(): Firestore {
  const app = getAdminApp();
  return getFirestore(app);
}
