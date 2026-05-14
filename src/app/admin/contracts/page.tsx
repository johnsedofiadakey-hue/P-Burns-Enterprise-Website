'use client'

import { useState, useEffect } from 'react'
import { db, storage } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Link from 'next/link'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<any>(null)
  
  // Form State
  const [customer, setCustomer] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('pending')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [contractFile, setContractFile] = useState<File | null>(null)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "contracts"));
      const fetchedContracts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContracts(fetchedContracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      showToast("Error fetching contracts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) return;
    
    try {
      await deleteDoc(doc(db, "contracts", id));
      setContracts(contracts.filter(c => c.id !== id));
      showToast("Contract deleted successfully!");
    } catch (error) {
      console.error("Error deleting contract:", error);
      showToast("Error deleting contract", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let documentUrl = '';
      if (contractFile) {
        const storageRef = ref(storage, `contracts/${Date.now()}_${contractFile.name}`);
        const snapshot = await uploadBytes(storageRef, contractFile);
        documentUrl = await getDownloadURL(snapshot.ref);
      }

      const docData = {
        customer,
        serviceType,
        value: parseFloat(value),
        status,
        startDate,
        documentUrl,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "contracts"), docData);
      
      showToast('Contract added successfully!');
      setIsAddModalOpen(false);
      // Reset form
      setCustomer('');
      setServiceType('');
      setValue('');
      setStatus('pending');
      setStartDate(new Date().toISOString().split('T')[0]);
      
      // Refresh list
      fetchContracts();
    } catch (error: any) {
      console.error("Error adding contract:", error);
      showToast('Error adding contract: ' + error.message, "error");
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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Contracts</h2>
          <p className="text-sm text-gray-500">Manage service contracts and projects</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Contract
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">All Contracts</span>
          <span className="text-xs text-gray-400">{contracts.length} items</span>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Service Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Value</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">Loading contracts...</td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">No contracts found. Add one!</td>
              </tr>
            ) : contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{contract.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.serviceType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">GH₵ {typeof contract.value === 'number' ? contract.value.toFixed(2) : contract.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                    contract.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' : 
                    contract.status === 'deposit_paid' ? 'bg-blue-50 text-blue-700' : 
                    contract.status === 'completed' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {contract.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button 
                    onClick={() => {
                      setEditingContract(contract);
                      setIsEditModalOpen(true);
                    }}
                    className="text-gold-600 hover:text-gold-900 font-bold mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(contract.id)}
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

      {/* Add Contract Modal (Slide-in from right) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add Contract</h3>
                <p className="text-xs text-gray-500 mt-1">Create a new service contract</p>
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Name</label>
                <input 
                  type="text" 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Ministry of Works"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Service Type</label>
                <input 
                  type="text" 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Tile Supply, Installation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Contract Value (GH₵)</label>
                <input 
                  type="number" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required 
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Contract Document (PDF/Image)</label>
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={(e) => setContractFile(e.target.files?.[0] || null)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
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
                {saving ? 'Adding...' : 'Add Contract'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contract Modal (Slide-in from right) */}
      {isEditModalOpen && editingContract && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsEditModalOpen(false)}></div>
          
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Edit Contract</h3>
                <p className="text-xs text-gray-500 mt-1">Update contract details</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-[#111111] transition-colors text-2xl">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Name</label>
                <input 
                  type="text" 
                  value={editingContract.customer}
                  onChange={(e) => setEditingContract({...editingContract, customer: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Service Type</label>
                <input 
                  type="text" 
                  value={editingContract.serviceType}
                  onChange={(e) => setEditingContract({...editingContract, serviceType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Contract Value (GH₵)</label>
                <input 
                  type="number" 
                  value={editingContract.value}
                  onChange={(e) => setEditingContract({...editingContract, value: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={editingContract.status}
                  onChange={(e) => setEditingContract({...editingContract, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setSaving(true);
                  try {
                    await updateDoc(doc(db, "contracts", editingContract.id), {
                      customer: editingContract.customer,
                      serviceType: editingContract.serviceType,
                      status: editingContract.status,
                      value: editingContract.value,
                      updatedAt: new Date().toISOString()
                    });
                    showToast('Contract updated successfully!');
                    setIsEditModalOpen(false);
                    fetchContracts();
                  } catch (error) {
                    console.error("Error updating contract:", error);
                    showToast('Error updating contract', 'error');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
