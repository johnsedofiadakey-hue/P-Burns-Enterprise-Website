'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
    const foundProduct = mockProducts.find(p => p.id === id)
    if (foundProduct) {
      setProduct(foundProduct)
    }
  }, [id])

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>
  }

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/shop" className="text-emerald-600 hover:text-emerald-700 font-medium">&larr; Back to Shop</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
          <div className="text-gray-400">Product Image Placeholder</div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 capitalize mb-4">{product.category}</p>
            <p className="text-2xl font-bold text-emerald-600 mb-4">GH₵ {product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity:</label>
              <input 
                type="number" 
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                disabled={product.stock === 0}
              />
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-md font-medium text-white mb-2 ${
                product.stock > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button 
              onClick={() => alert('Quote requested')}
              className="w-full py-3 px-6 rounded-md font-medium text-emerald-600 border border-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
