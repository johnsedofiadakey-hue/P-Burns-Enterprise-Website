'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('China')
  const [type, setType] = useState('Ceramics')
  const [submitting, setSubmitting] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchSuppliers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      showToast("Error fetching suppliers", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      await addDoc(collection(db, "suppliers"), {
        name,
        contact,
        email,
        phone,
        country,
        type,
        createdAt: new Date().toISOString()
      });
      
      showToast('Supplier added successfully!');
      setShowModal(false);
      // Reset form
      setName('');
      setContact('');
      setEmail('');
      setPhone('');
      setCountry('China');
      setType('Ceramics');
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier:", error);
      showToast('Error adding supplier', 'error');
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await deleteDoc(doc(db, "suppliers", id));
      showToast('Supplier deleted successfully!');
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      showToast('Error deleting supplier', 'error');
    }
  }

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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Supplier Management</h2>
          <p className="text-sm text-gray-700">Manage your global and local suppliers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20"
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="text-gray-700 text-sm">Loading suppliers...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Country</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-700 text-sm">No suppliers found.</td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{supplier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{supplier.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{supplier.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${
                        supplier.type === 'Ceramics' ? 'bg-amber-100 text-amber-800' :
                        supplier.type === 'Doors' ? 'bg-blue-100 text-blue-800' :
                        supplier.type === 'Home Items' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-500 hover:text-red-700 font-bold uppercase text-xs tracking-wider"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-in Modal for Add Supplier */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${showModal ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-serif font-bold text-[#111111]">Add New Supplier</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-[#111111] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5 h-[calc(100%-73px)] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Supplier Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Contact Person</label>
              <input 
                type="text" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Product Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              >
                <option value="Ceramics">Ceramics</option>
                <option value="Doors">Doors</option>
                <option value="Home Items">Home Items</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? 'Saving...' : 'Save Supplier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
