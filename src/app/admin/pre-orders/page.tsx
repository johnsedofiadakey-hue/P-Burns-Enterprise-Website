'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data
const mockPreOrders = [
  { id: '1', customer: 'John Doe', item: 'Premium Ceramic Tiles (Wood Finish)', supplier: 'China Supplier Ltd', arrivalDate: '2026-06-15', status: 'ordered', total: 1200.00 },
  { id: '2', customer: 'Jane Smith', item: 'Custom: Modern Chandelier', supplier: 'Turkey Doors Inc', arrivalDate: '2026-05-20', status: 'in_transit', total: 3450.00 },
]

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState(mockPreOrders)
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  
  return (
    <div className="relative">
      {/* Animated Toast or Header can be added here */}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Pre-Orders</h2>
          <p className="text-sm text-gray-700">Manage customer special requests and pre-arrivals</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Pre-Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Item</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Est. Arrival</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {preOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.item}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.arrivalDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                    order.status === 'ordered' ? 'bg-blue-50 text-blue-700' : 
                    order.status === 'in_transit' ? 'bg-yellow-50 text-yellow-700' : 
                    'bg-green-50 text-green-700'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gold-600">GH₵ {order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right flex justify-end gap-4">
                  <Link href={`/admin/pre-orders/${order.id}/edit`} className="text-gold-600 hover:text-gold-700 transition-colors">Edit</Link>
                  <button className="text-red-600 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mock Slide-in Modal for Add */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add Pre-Order</h3>
                <p className="text-xs text-gray-700 mt-1">Record a new customer request</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-[#111111] text-2xl">✕</button>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center text-gray-600 font-medium">
              Form will be connected to Firestore in the next step.
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 font-bold text-sm hover:bg-gray-50">Cancel</button>
              <button disabled className="flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg opacity-50 cursor-not-allowed">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
