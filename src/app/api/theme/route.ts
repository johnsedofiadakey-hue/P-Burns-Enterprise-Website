import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const docRef = doc(db, "settings", "theme");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data())
    } else {
      // Fallback default theme
      return NextResponse.json({
        primary: '#B68D40',
        secondary: '#111111',
        background: '#FAFAFA'
      })
    }
  } catch (error: any) {
    console.error("Error reading theme from Firestore:", error);
    return NextResponse.json({ error: 'Failed to read theme' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { primary, secondary, background } = body
    
    // Simple validation
    if (!primary || !secondary || !background) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    
    await setDoc(doc(db, "settings", "theme"), {
      primary,
      secondary,
      background,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating theme in Firestore:", error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 })
  }
}
