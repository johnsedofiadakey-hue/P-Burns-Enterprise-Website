import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin
function getAdminApp() {
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const adminApp = getAdminApp();
    const bucket = getStorage(adminApp).bucket();
    
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const fileRef = bucket.file(fileName);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    // We do NOT use makePublic() because new Firebase buckets have Uniform Bucket-Level Access enabled.
    // Instead, we construct the standard Firebase Storage download URL format.
    const encodedFileName = encodeURIComponent(fileName);
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/p-burnsenterprise.firebasestorage.app/o/${encodedFileName}?alt=media`;
    
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
