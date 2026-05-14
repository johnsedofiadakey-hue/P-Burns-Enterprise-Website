'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('Retail')
  const [saving, setSaving] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const fetchedCustomers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map(doc => doc.data());

      const enrichedCustomers = fetchedCustomers.map(customer => {
        const customerOrders = orders.filter(order => order.customerId === customer.id || order.customer === (customer as any).name);
        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((acc, order) => acc + (typeof order.total === 'number' ? order.total : parseFloat(order.total || 0)), 0);
        return {
          ...customer,
          totalOrders,
          totalSpent
        };
      });

      setCustomers(enrichedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showToast("Error fetching customers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await deleteDoc(doc(db, "customers", id));
      setCustomers(customers.filter(c => c.id !== id));
      showToast("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      showToast("Error deleting customer", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docData = {
        name,
        email,
        phone,
        type,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "customers"), docData);
      
      showToast('Customer added successfully!');
      setIsAddModalOpen(false);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setType('Retail');
      
      // Refresh list
      fetchCustomers();
    } catch (error: any) {
      console.error("Error adding customer:", error);
      showToast('Error adding customer: ' + error.message, "error");
    } finally {
      setSaving(false);
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Customers</h2>
          <p className="text-sm text-gray-500">Manage your customer database</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">All Customers</span>
          <span className="text-xs text-gray-400">{customers.length} items</span>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Spent</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">No customers found. Add one!</td>
              </tr>
            ) : customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">GH₵ {(customer.totalSpent || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                    customer.type === 'Retail' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {customer.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <Link href={`/admin/customers/${customer.id}`} className="text-gold-600 hover:text-gold-900 font-bold mr-4">View</Link>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal (Slide-in from right) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add Customer</h3>
                <p className="text-xs text-gray-500 mt-1">Create a new customer profile</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-[#111111] transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. +233 241234567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="Retail">Retail</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
