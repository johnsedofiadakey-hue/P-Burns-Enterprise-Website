'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const preOrderItems = [
  { id: '1', name: 'Premium Ceramic Tiles (Wood Finish)', arrival: 'June 2026', price: 120.00 },
  { id: '2', name: 'Luxury Security Door (Steel)', arrival: 'July 2026', price: 1500.00 },
]

export default function PreOrderPage() {
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [customItemName, setCustomItemName] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  
  const [trackId, setTrackId] = useState('')
  const [trackResult, setTrackResult] = useState<any>(null)
  const [trackLoading, setTrackLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setTrackLoading(true)
    setTrackResult(null)
    try {
      const docRef = doc(db, 'pre_orders', trackId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setTrackResult(docSnap.data());
      } else {
        alert('No pre-order found with that ID.');
      }
    } catch (error) {
      console.error("Error tracking pre-order:", error);
      alert('An error occurred while tracking.');
    } finally {
      setTrackLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const itemToOrder = selectedItem === 'custom' 
      ? `Custom: ${customItemName}` 
      : preOrderItems.find(i => i.id === selectedItem)?.name;
      
    try {
      const response = await fetch('/api/pre-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          itemToOrder,
          quantity,
          description: customDescription
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Pre-order request submitted successfully! We have sent a confirmation email to ${email}.`)
        // Reset form
        setSelectedItem('')
        setQuantity(1)
        setName('')
        setEmail('')
        setCustomItemName('')
        setCustomDescription('')
      } else {
        alert('Failed to submit request. Please try again.')
      }
    } catch (error) {
      console.error("Error submitting pre-order:", error);
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Direct Sourcing</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-4">Pre-Orders</h1>
        <p className="text-gray-800 mb-12 max-w-3xl text-lg">
          Order items directly from our China shipments before they arrive and enjoy better rates. 
          Secure your items with a deposit. You can also make special requests for items not listed here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Available Items */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-[#111111]">Available for Pre-Order</h2>
              <button 
                onClick={() => setSelectedItem('custom')}
                className="text-gold-600 hover:text-gold-700 font-bold text-sm uppercase tracking-wider"
              >
                Special Request &rarr;
              </button>
            </div>
            <div className="space-y-6">
              {preOrderItems.map(item => (
                <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-xl shadow-charcoal-900/5 border transition-all ${selectedItem === item.id ? 'border-gold-500' : 'border-gray-100'} flex justify-between items-center gap-4`}>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#111111]">{item.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">Estimated Arrival: {item.arrival}</p>
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
              
              {/* Custom Request Card */}
              <div 
                onClick={() => setSelectedItem('custom')}
                className={`bg-white p-6 rounded-2xl shadow-xl shadow-charcoal-900/5 border cursor-pointer transition-all ${selectedItem === 'custom' ? 'border-gold-500 bg-gold-50/10' : 'border-dashed border-gray-300 hover:border-gold-300'} flex justify-between items-center gap-4`}
              >
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#111111]">Special Request</h3>
                  <p className="text-sm text-gray-700 mt-1">Request an item not listed above</p>
                  <p className="text-gold-600 font-bold mt-2">Custom Pricing</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedItem === 'custom' ? 'border-gold-600 bg-gold-600 text-white' : 'border-gray-300'}`}>
                  {selectedItem === 'custom' && '✓'}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 h-fit">
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
                  <option value="custom">Special Request / Custom Item</option>
                </select>
              </div>

              {selectedItem === 'custom' && (
                <div className="space-y-4 border-l-4 border-gold-500 pl-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Item Name</label>
                    <input 
                      type="text" 
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      required 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                      placeholder="What are you looking for?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Description / Specifications</label>
                    <textarea 
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                      placeholder="Size, color, material, etc."
                    />
                  </div>
                </div>
              )}

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
                className="w-full py-4 bg-[#111111] text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20"
              >
                Submit Pre-Order Request
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
          <div className="max-w-3xl">
            <h2 className="text-xl font-serif font-bold text-[#111111] mb-2">Track Your Pre-Order</h2>
            <p className="text-gray-600 mb-6">Enter your Tracking ID to check the status of your request.</p>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                required 
                placeholder="Enter Tracking ID (e.g. xY7z...)"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
              />
              <button 
                type="submit"
                disabled={trackLoading}
                className="px-8 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 disabled:bg-gray-400"
              >
                {trackLoading ? 'Searching...' : 'Track Status'}
              </button>
            </form>

            {trackResult && (
              <div className="mt-8 p-6 bg-gold-50/20 rounded-xl border border-gold-100">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <div className="text-lg font-bold text-[#111111] mt-1 capitalize">
                      {trackResult.status === 'pending' ? '⏳ Pending Review' : 
                       trackResult.status === 'approved' ? '✅ Approved' : 
                       trackResult.status === 'shipped' ? '🚢 Shipped' : 
                       trackResult.status === 'arrived' ? '📍 Arrived' : 
                       trackResult.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Item</span>
                    <div className="text-sm font-bold text-[#111111] mt-1">{trackResult.item}</div>
                    <div className="text-xs text-gray-500">Qty: {trackResult.quantity}</div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
                    <div className="text-sm font-bold text-[#111111] mt-1">
                      {trackResult.estimatedArrival || 'TBD (To Be Determined)'}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
                    <div className="text-sm font-bold text-[#111111] mt-1">
                      {trackResult.price ? `GH₵ ${trackResult.price.toFixed(2)}` : 'Pending Pricing'}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">CBM / Shipping</span>
                    <div className="text-sm font-bold text-[#111111] mt-1">
                      {trackResult.cbm ? `${trackResult.cbm} CBM` : 'N/A'} 
                      {trackResult.shippingCost ? ` / GH₵ ${trackResult.shippingCost.toFixed(2)}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Latest Update</span>
                    <div className="text-sm text-gray-600 mt-1">
                      {trackResult.deliveryUpdate || 'Order is being processed.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
