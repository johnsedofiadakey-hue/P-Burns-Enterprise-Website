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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">China Import Pre-Orders</h1>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Order items directly from our China shipments before they arrive and enjoy better rates. 
        Secure your items with a deposit.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Available Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available for Pre-Order</h2>
          <div className="space-y-4">
            {preOrderItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Estimated Arrival: {item.arrival}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-emerald-600 font-bold">GH₵ {item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => setSelectedItem(item.id)}
                    className={`text-sm font-medium ${selectedItem === item.id ? 'text-emerald-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                  >
                    {selectedItem === item.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Place Your Pre-Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Item</label>
              <select 
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Choose an item...</option>
                {preOrderItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
            >
              Submit Pre-Order Request
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
