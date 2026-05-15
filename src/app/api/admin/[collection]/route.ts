import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getAdminDb } from '@/lib/firebase-admin';

// GET /api/admin/[collection] - List all documents
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminDb();
    
    const snapshot = await db.collection(collection).orderBy('createdAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error in GET /api/admin/${collection}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/[collection] - Create a new document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const db = getAdminDb();
    
    // Add createdAt if not present
    const docData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };

    const docRef = await db.collection(collection).add(docData);

    return NextResponse.json({ id: docRef.id, ...docData });
  } catch (error: any) {
    console.error(`Error in POST /api/admin/${collection}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
