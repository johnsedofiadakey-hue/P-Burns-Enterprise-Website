import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    const db = getAdminDb();
    const trimmedId = id.trim();
    
    // Search by orderNumber
    const snapshot = await db.collection('orders').where('orderNumber', '==', trimmedId.toUpperCase()).get();
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return NextResponse.json({
        success: true,
        data: {
          orderNumber: data.orderNumber,
          status: data.status,
          createdAt: data.createdAt,
          items: data.items?.map((item: any) => ({ name: item.name, quantity: item.quantity })) || []
        }
      });
    }
    
    // Fallback: Search by doc ID
    try {
      const doc = await db.collection('orders').doc(trimmedId).get();
      if (doc.exists) {
        const data = doc.data();
        return NextResponse.json({
          success: true,
          data: {
            orderNumber: data?.orderNumber,
            status: data?.status,
            createdAt: data?.createdAt,
            items: data?.items?.map((item: any) => ({ name: item.name, quantity: item.quantity })) || []
          }
        });
      }
    } catch (e) {
      // Ignore error if it's not a valid doc ID format
    }
    
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error("Error in track API:", error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
