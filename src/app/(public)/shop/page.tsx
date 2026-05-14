import ShopClient from './ShopClient'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

// Fallback/Initial data
const initialProducts = [
  { id: '1', name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, image: '/placeholder.png' },
  { id: '2', name: 'Wooden Door B', category: 'doors', price: 450.00, image: '/placeholder.png' },
  { id: '3', name: 'Home Item C', category: 'home_items', price: 85.00, image: '/placeholder.png' },
  { id: '4', name: 'Ceramic Tile B', category: 'ceramics', price: 150.00, image: '/placeholder.png' },
  { id: '5', name: 'Steel Door', category: 'doors', price: 600.00, image: '/placeholder.png' },
]

export default async function ShopPage() {
  let products = initialProducts;
  let categories: any[] = [];

  try {
    const [productsSnap, categoriesSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories"))
    ]);
    
    if (!productsSnap.empty) {
      products = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
    }
    
    if (!categoriesSnap.empty) {
      categories = categoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  } catch (error) {
    console.error("Error fetching data from Firestore in Server Component:", error);
  }

  return <ShopClient products={products} categories={categories} />
}
