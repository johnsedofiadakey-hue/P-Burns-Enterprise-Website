import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, comment, name, email } = body;

    if (!productId || !rating || !comment || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const reviewData = {
      productId,
      rating: Number(rating),
      comment,
      name,
      email: email || '',
      status: 'approved', // Default to approved for simplicity
      createdAt: new Date().toISOString()
    };

    const db = getAdminDb();
    const docRef = await db.collection("reviews").add(reviewData);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
