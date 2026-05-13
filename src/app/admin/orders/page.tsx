'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date descending if available
      fetchedOrders.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Error fetching orders", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders(orders.filter(o => o.id !== id));
      showToast("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      showToast("Error deleting order", "error");
    }
  };

  return (
    <div className="relative">
      {/* Animated Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out translate-y-0 opacity-100 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2`}>
          {toast.type === 'success' ? '✨' : '🛑'}
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Order Management</h2>
          <p className="text-sm text-gray-500">View and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Order #</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">No orders found.</td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">GH₵ {typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                    order.status === 'processing' ? 'bg-blue-50 text-blue-700' : 
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold flex gap-4">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="text-gold-600 hover:text-gold-700 transition-colors"
                  >
                    View
                  </button>
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

      {/* Slide-in Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Order Details</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedOrder.orderNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-[#111111] transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</h4>
                <p className="text-sm font-bold text-[#111111]">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedOrder.address}</p>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                      <span className="font-bold text-[#111111]">GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-[#111111]">GH₵ {selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-bold text-[#111111]">GH₵ {selectedOrder.deliveryFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-serif font-bold border-t border-gray-100 pt-2">
                  <span className="text-[#111111]">Total</span>
                  <span className="text-gold-600">GH₵ {selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</h4>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                  selectedOrder.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                  selectedOrder.status === 'processing' ? 'bg-blue-50 text-blue-700' : 
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
