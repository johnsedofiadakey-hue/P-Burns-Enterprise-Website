'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ShopClientProps {
  products: any[];
  categories: any[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    if (!searchQuery) return;
    
    const timer = setTimeout(() => {
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
          type: 'search',
          query: searchQuery,
          resultsCount: filteredProducts.length
        })
      }).catch(() => {});
    }, 1500); // Debounce for 1.5 seconds
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
    const matchesSearch = words.length === 0 || words.every(word => product.name.toLowerCase().includes(word))
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'newest') {
      const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
      const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  })

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Page Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Our Collection</span>
          <h1 className="text-4xl font-serif font-bold text-charcoal-950 mb-4">Premium Materials</h1>
          <p className="text-gray-500 text-lg">Sourced directly from top global manufacturers for unmatched quality.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-950 mb-6">Categories</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    selectedCategory === '' ? 'bg-gold-500/10 text-gold-600' : 'text-gray-600 hover:text-charcoal-950 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === cat.id ? 'bg-gold-500/10 text-gold-600' : 'text-gray-600 hover:text-charcoal-950 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input 
                  type="text" 
                  placeholder="Search materials..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gold-500 transition-colors text-sm" 
                />
                <svg className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                
                {searchQuery.length > 1 && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map((product: any) => (
                        <Link 
                          key={product.id} 
                          href={`/shop/${product.id}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-10 h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-charcoal-950 truncate">{product.name}</p>
                            <p className="text-xs text-gold-600 font-bold">GH₵ {product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-3 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 transition-colors text-sm" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-3 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 transition-colors text-sm" 
                />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 transition-colors text-sm text-gray-600"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-xl shadow-charcoal-900/5 hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden group">
                  <Link href={`/shop/${product.id}`}>
                    <div className="relative h-64 bg-gradient-to-br from-charcoal-900 to-charcoal-950 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-all duration-500" unoptimized />
                      ) : (
                        <>
                          <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
                          <svg className="w-12 h-12 text-gold-500/50 group-hover:scale-110 group-hover:text-gold-500 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
                      {categories.find(c => c.id === product.category)?.name || 
                       (product.category === 'ceramics' ? 'Ceramics' : 
                        product.category === 'doors' ? 'Doors' : 
                        product.category === 'home_items' ? 'Home Items' : 
                        product.category)}
                    </div>
                    <h3 className="text-lg font-bold text-charcoal-950 uppercase tracking-tight mb-2">
                      <Link href={`/shop/${product.id}`} className="hover:text-gold-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-lg font-black text-charcoal-950">GH₵ {product.price.toFixed(2)}</p>
                        {product.stock !== undefined && (
                          <p className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} items left` : 'Out of Stock'}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          const savedCart = localStorage.getItem('cart')
                          const cart = savedCart ? JSON.parse(savedCart) : []
                          const existingItem = cart.find((item: any) => item.id === product.id)
                          if (existingItem) {
                            existingItem.quantity += 1
                          } else {
                            cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image })
                          }
                          localStorage.setItem('cart', JSON.stringify(cart))
                          window.dispatchEvent(new Event('cart-updated'))
                          alert(`Added ${product.name} to cart!`)
                        }}
                        disabled={product.stock === 0}
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${product.stock === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-charcoal-950 hover:text-gold-600'}`}
                      >
                        {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.341A8 8 0 116.586 6.586 8 8 0 0119.428 15.341zM15 15l6 6"></path></svg>
                <p className="text-gray-500 text-lg mb-6">No products found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center space-x-2">
                <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 text-sm font-medium">Previous</button>
                <button className="px-4 py-2 bg-gold-600 text-white rounded-full font-medium text-sm">1</button>
                <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 text-sm font-medium">2</button>
                <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 text-sm font-medium">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
