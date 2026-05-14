'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [customer, setCustomer] = useState('')
  const [item, setItem] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [total, setTotal] = useState('')
  const [status, setStatus] = useState('ordered')
  const [submitting, setSubmitting] = useState(false)

  const fetchPreOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "pre_orders"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPreOrders(data);
    } catch (error) {
      console.error("Error fetching pre-orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "pre_orders"), {
        customer,
        item,
        arrivalDate,
        total: parseFloat(total),
        status,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setCustomer('');
      setItem('');
      setArrivalDate('');
      setTotal('');
      setStatus('ordered');
      fetchPreOrders();
    } catch (error) {
      console.error("Error adding pre-order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pre-order?')) return;
    try {
      await deleteDoc(doc(db, "pre_orders", id));
      fetchPreOrders();
    } catch (error) {
      console.error("Error deleting pre-order:", error);
    }
  };
  
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

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">Loading pre-orders...</td>
              </tr>
            ) : preOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">No pre-orders found.</td>
              </tr>
            ) : preOrders.map((order) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gold-600">GH₵ {typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(order.total || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right flex justify-end gap-4">
                  <button 
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
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
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Name</label>
                <input 
                  type="text" 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Item Requested</label>
                <input 
                  type="text" 
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Est. Arrival Date</label>
                <input 
                  type="date" 
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Total Amount (GH₵)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="ordered">Ordered</option>
                  <option value="in_transit">In Transit</option>
                  <option value="arrived">Arrived</option>
                </select>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 font-bold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
