import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

// Mock data to seed
const mockProducts = [
  { name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, image: '/category_ceramics.png' },
  { name: 'Wooden Door B', category: 'doors', price: 450.00, image: '/category_doors.png' },
  { name: 'Home Item C', category: 'home_items', price: 85.00, image: '/category_home_items.png' },
  { name: 'Ceramic Tile B', category: 'ceramics', price: 150.00, image: '/category_ceramics.png' },
  { name: 'Steel Door', category: 'doors', price: 600.00, image: '/category_doors.png' },
]

export async function GET() {
  try {
    // 1. Clear existing products (optional, but good for testing)
    const querySnapshot = await getDocs(collection(db, "products"));
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(db, "products", document.id));
    }

    // 2. Add mock products
    const addedIds = [];
    for (const product of mockProducts) {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date().toISOString()
      });
      addedIds.push(docRef.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${addedIds.length} products successfully!`,
      ids: addedIds
    })
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
