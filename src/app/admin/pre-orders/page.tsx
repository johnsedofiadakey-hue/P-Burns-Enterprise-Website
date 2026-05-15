'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [customer, setCustomer] = useState('')
  const [item, setItem] = useState('')
  const [phone, setPhone] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [total, setTotal] = useState('')
  const [status, setStatus] = useState('ordered')
  const [submitting, setSubmitting] = useState(false)
  
  // Edit State
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [editStatus, setEditStatus] = useState('pending')
  const [editPhone, setEditPhone] = useState('')
  const [editArrivalDate, setEditArrivalDate] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCbm, setEditCbm] = useState('')
  const [editShippingCost, setEditShippingCost] = useState('')
  const [editDeliveryUpdate, setEditDeliveryUpdate] = useState('')

  const fetchPreOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pre_orders');
      if (!res.ok) throw new Error('Failed to fetch pre-orders');
      const data = await res.json();
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
      const res = await fetch('/api/admin/pre_orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          item,
          phone,
          arrivalDate,
          total: parseFloat(total),
          status,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create pre-order');
      }

      setShowModal(false);
      setCustomer('');
      setItem('');
      setPhone('');
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

  const handleEdit = (order: any) => {
    setEditingOrder(order)
    setEditStatus(order.status || 'pending')
    setEditPhone(order.phone || '')
    setEditArrivalDate(order.estimatedArrival || '')
    setEditPrice(order.price || '')
    setEditCbm(order.cbm || '')
    setEditShippingCost(order.shippingCost || '')
    setEditDeliveryUpdate(order.deliveryUpdate || '')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/pre_orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          phone: editPhone,
          estimatedArrival: editArrivalDate,
          price: editPrice ? parseFloat(editPrice) : null,
          cbm: editCbm || '',
          shippingCost: editShippingCost ? parseFloat(editShippingCost) : null,
          deliveryUpdate: editDeliveryUpdate || ''
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update pre-order');
      }

      setEditingOrder(null)
      fetchPreOrders()
    } catch (error) {
      console.error("Error updating pre-order:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pre-order?')) return;
    try {
      const res = await fetch(`/api/admin/pre_orders/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete pre-order');
      }

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
                    onClick={() => handleEdit(order)}
                    className="text-gold-600 hover:text-gold-700 transition-colors"
                  >
                    Edit
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

      {/* Slide-in Modal for Edit */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setEditingOrder(null)}></div>
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Edit Pre-Order</h3>
                <p className="text-xs text-gray-700 mt-1">Update status for {editingOrder.customer}</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-[#111111] text-2xl">✕</button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 flex-1 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  type="text" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Estimated Arrival</label>
                <input 
                  type="text" 
                  value={editArrivalDate}
                  onChange={(e) => setEditArrivalDate(e.target.value)}
                  placeholder="e.g. June 2026"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Price (GH₵)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Total CBM</label>
                <input 
                  type="text" 
                  value={editCbm}
                  onChange={(e) => setEditCbm(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Shipping Cost (GH₵)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={editShippingCost}
                  onChange={(e) => setEditShippingCost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Delivery Update</label>
                <textarea 
                  value={editDeliveryUpdate}
                  onChange={(e) => setEditDeliveryUpdate(e.target.value)}
                  placeholder="e.g. Loaded onto container."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="arrived">Arrived</option>
                </select>
              </div>
              
              <div className="pt-4 space-y-3">
                <button type="submit" disabled={submitting} className={`w-full px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {submitting ? 'Saving...' : 'Update Status'}
                </button>
                
                {editPhone && (
                  <a 
                    href={`https://wa.me/${editPhone.replace('+', '')}?text=${encodeURIComponent(`Hello ${editingOrder.customer}, your pre-order for ${editingOrder.item} status has been updated to: ${editStatus.replace('_', ' ')}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 py-3 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                    Message via WhatsApp
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233..." 
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
