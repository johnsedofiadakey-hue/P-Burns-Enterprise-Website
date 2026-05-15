import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getAdminDb } from '@/lib/firebase-admin';

// PUT /api/admin/[collection]/[id] - Update a document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string, id: string }> }
) {
  const { collection, id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const db = getAdminDb();
    
    // Add updatedAt
    const docData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await db.collection(collection).doc(id).set(docData, { merge: true });

    return NextResponse.json({ id, ...docData });
  } catch (error: any) {
    console.error(`Error in PUT /api/admin/${collection}/${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/[collection]/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string, id: string }> }
) {
  const { collection, id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminDb();
    
    await db.collection(collection).doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/${collection}/${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
