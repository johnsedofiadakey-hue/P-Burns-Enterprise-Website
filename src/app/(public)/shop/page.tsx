'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Mock data
const mockProducts = [
  { id: '1', name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, image: '/placeholder.png' },
  { id: '2', name: 'Wooden Door B', category: 'doors', price: 450.00, image: '/placeholder.png' },
  { id: '3', name: 'Home Item C', category: 'home_items', price: 85.00, image: '/placeholder.png' },
  { id: '4', name: 'Ceramic Tile B', category: 'ceramics', price: 150.00, image: '/placeholder.png' },
  { id: '5', name: 'Steel Door', category: 'doors', price: 600.00, image: '/placeholder.png' },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="category" 
                    value="" 
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">All</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="category" 
                    value="ceramics" 
                    checked={selectedCategory === 'ceramics'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Ceramics</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="category" 
                    value="doors" 
                    checked={selectedCategory === 'doors'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Doors</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="category" 
                    value="home_items" 
                    checked={selectedCategory === 'home_items'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Home Items</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group relative">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 h-64 flex items-center justify-center relative">
                  <div className="text-gray-400">Product Image</div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/shop/${product.id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">GH₵ {product.price.toFixed(2)}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        alert(`Added ${product.name} to cart`)
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 relative z-10"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">Previous</button>
              <button className="px-3 py-1 bg-emerald-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
