import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
    const data = await request.json();
    
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    
    let location = { city: 'Unknown', country: 'Unknown' };
    try {
      // Free IP geolocation API
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city`);
      const geoData = await geoRes.json();
      if (geoData.status === 'success') {
        location = { city: geoData.city, country: geoData.country };
      }
    } catch (e) {
      // Silent fail for geo lookup
    }
    
    // Save to market_insights collection
    await db.collection('market_insights').add({
      type: data.type || 'timespent',
      ...data,
      location,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics save error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
