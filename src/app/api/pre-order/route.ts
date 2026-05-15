import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, itemToOrder, quantity, description } = body;

    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    // Save to pre_orders collection
    const docRef = await db.collection('pre_orders').add({
      customer: name,
      email,
      item: itemToOrder,
      quantity,
      description: description || '',
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    const orderId = docRef.id;

    // Send email to admin
    await sendEmail({
      to: 'info@pburns.com', // You can update this to your actual admin email
      subject: `New Pre-Order Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; font-family: serif;">New Pre-Order Request</h1>
          <p style="color: #555;">You have received a new pre-order request on the website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Customer Email:</strong> ${email}</p>
          <p><strong>Item Requested:</strong> ${itemToOrder}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Custom Description:</strong> ${description || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
        </div>
      `
    });

    // Send email to customer
    await sendEmail({
      to: email,
      subject: 'Pre-Order Received - P-Burns Enterprise',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #111; font-family: serif;">Thank You for Your Request!</h1>
          <p style="color: #555;">Dear ${name},</p>
          <p style="color: #555;">We have received your pre-order request for <strong>${itemToOrder}</strong>.</p>
          <p style="color: #555;"><strong>Your Tracking ID:</strong> ${orderId}</p>
          <p style="color: #555;">Our team will review your request and contact you shortly to finalize details and provide pricing.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; text-align: center; font-size: 12px;">P-Burns Enterprise</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Error in pre-order API:", error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
