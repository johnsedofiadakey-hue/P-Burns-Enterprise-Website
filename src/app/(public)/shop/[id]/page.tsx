'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// Mock data
const mockProducts = [
  { id: '1', name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, description: 'High quality ceramic tile for floors and walls. Durable and easy to clean.', stock: 50 },
  { id: '2', name: 'Wooden Door B', category: 'doors', price: 450.00, description: 'Solid wooden door with elegant design. Suitable for main entrance or rooms.', stock: 10 },
  { id: '3', name: 'Home Item C', category: 'home_items', price: 85.00, description: 'Useful home item for daily use. High quality material.', stock: 0 },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Try mock data as fallback
          const foundProduct = mockProducts.find(p => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            router.push('/shop');
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, router])

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>
  }

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart`)
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-charcoal-950 hover:text-gold-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="relative h-[500px] bg-gradient-to-br from-charcoal-900 to-charcoal-950 rounded-sm flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
            <svg className="w-20 h-20 text-gold-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between py-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2 block">{product.category}</span>
              <h1 className="text-4xl font-black text-charcoal-950 uppercase tracking-tight mb-4">{product.name}</h1>
              <div className="w-16 h-1 bg-gold-500 mb-6"></div>
              
              <p className="text-3xl font-black text-charcoal-950 mb-6">GH₵ {product.price.toFixed(2)}</p>
              
              <div className="prose prose-sm text-gray-500 mb-8 max-w-none">
                <p>{product.description}</p>
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Status:</span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  product.stock > 0 ? 'bg-gold-500/10 text-gold-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-6 mb-8">
                <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</label>
                <div className="relative">
                  <input 
                    type="number" 
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 px-4 py-2 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 transition-colors text-sm font-bold text-charcoal-950" 
                    disabled={product.stock === 0}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-sm font-bold uppercase tracking-wider text-sm text-white transition-all ${
                    product.stock > 0 
                      ? 'bg-gold-600 hover:bg-gold-500 shadow-lg shadow-gold-900/20 active:scale-95' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  onClick={() => alert('Quote requested')}
                  className="w-full py-4 px-6 rounded-sm font-bold uppercase tracking-wider text-sm text-charcoal-950 border border-charcoal-950 hover:bg-charcoal-950 hover:text-white transition-all active:scale-95"
                >
                  Request a Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
