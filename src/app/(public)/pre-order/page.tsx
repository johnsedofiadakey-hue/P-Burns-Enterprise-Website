'use client'

import { useState } from 'react'

const preOrderItems = [
  { id: '1', name: 'Premium Ceramic Tiles (Wood Finish)', arrival: 'June 2026', price: 120.00 },
  { id: '2', name: 'Luxury Security Door (Steel)', arrival: 'July 2026', price: 1500.00 },
]

export default function PreOrderPage() {
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Pre-order request submitted (mock)')
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Direct Sourcing</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-4">Pre-Orders</h1>
        <p className="text-gray-600 mb-12 max-w-3xl text-lg">
          Order items directly from our China shipments before they arrive and enjoy better rates. 
          Secure your items with a deposit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Available Items */}
          <div>
            <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Available for Pre-Order</h2>
            <div className="space-y-6">
              {preOrderItems.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 flex justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#111111]">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Estimated Arrival: {item.arrival}</p>
                    <p className="text-gold-600 font-bold mt-2">GH₵ {item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(item.id)}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                      selectedItem === item.id 
                        ? 'bg-gold-600 text-white' 
                        : 'bg-[#FAFAFA] text-[#111111] hover:bg-gold-50 hover:text-gold-600 border border-gray-200'
                    }`}
                  >
                    {selectedItem === item.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Place Your Pre-Order</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Select Item</label>
                <select 
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                >
                  <option value="">Choose an item...</option>
                  {preOrderItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
              >
                Submit Pre-Order Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
