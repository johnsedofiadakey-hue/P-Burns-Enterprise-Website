'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setOrder(null);
    
    try {
      // Search by orderNumber
      const q = query(collection(db, "orders"), where("orderNumber", "==", orderId.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setOrder(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error tracking order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['Pending WhatsApp', 'Confirmed', 'Processing', 'Delivered', 'Completed'];
    const index = steps.indexOf(status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-serif font-bold text-[#111111] mb-2 text-center">Track Your Order</h1>
          <p className="text-gray-600 text-center mb-8">Enter your order number to see the current status.</p>
          
          <form onSubmit={handleTrack} className="flex gap-3 mb-8">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="e.g. PB-WA-XXXXXX"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
            <button 
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gold-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {searched && !loading && !order && (
            <div className="text-center text-red-600 font-bold">
              Order not found. Please check the ID and try again.
            </div>
          )}

          {order && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="text-sm text-gray-500">Order Number</div>
                <div className="text-xl font-bold text-[#111111]">{order.orderNumber}</div>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-lg font-bold text-gold-600">{order.status}</div>
              </div>

              {/* Timeline */}
              <div className="relative mt-8">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {['Pending WhatsApp', 'Confirmed', 'Processing', 'Delivered', 'Completed'].map((step, index) => {
                  const currentStep = getStatusStep(order.status);
                  const isCompleted = index <= currentStep;
                  
                  return (
                    <div key={step} className="flex items-center mb-6 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                        isCompleted ? 'bg-gold-500 text-[#111111]' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="ml-4">
                        <div className={`font-bold ${isCompleted ? 'text-[#111111]' : 'text-gray-400'}`}>{step}</div>
                        {index === currentStep && (
                          <div className="text-xs text-gold-600 font-medium">Current Stage</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
