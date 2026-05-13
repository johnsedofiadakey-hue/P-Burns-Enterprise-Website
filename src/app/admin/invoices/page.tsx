'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [docType, setDocType] = useState('invoice') // invoice, quote, receipt, refund
  const [customer, setCustomer] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([{ name: '', quantity: 1, rate: 0 }])
  const [notes, setNotes] = useState('Thanks for your business.')
  const [saving, setSaving] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const fetchedInvoices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInvoices(fetchedInvoices);
      if (fetchedInvoices.length > 0 && !selectedInvoice) {
        setSelectedInvoice(fetchedInvoices[0]); // Select first one by default if none selected
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showToast("Error fetching invoices", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await deleteDoc(doc(db, "invoices", id));
      const updatedInvoices = invoices.filter(i => i.id !== id);
      setInvoices(updatedInvoices);
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(updatedInvoices.length > 0 ? updatedInvoices[0] : null);
      }
      showToast("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showToast("Error deleting invoice", "error");
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, rate: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const total = calculateTotal();
    const docNumber = `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`; // Better to generate sequential numbers in production
    
    try {
      const docData = {
        invoiceNumber: docNumber,
        customer,
        date,
        items,
        total,
        notes,
        status: 'draft',
        type: docType,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "invoices"), docData);
      
      showToast('Document created successfully!');
      setIsCreateModalOpen(false);
      // Reset form
      setCustomer('');
      setItems([{ name: '', quantity: 1, rate: 0 }]);
      setNotes('Thanks for your business.');
      
      // Refresh list
      fetchInvoices();
    } catch (error: any) {
      console.error("Error adding document:", error);
      showToast('Error creating document: ' + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-120px)] flex flex-col">
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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Invoices</h2>
          <p className="text-sm text-gray-500">Manage invoices, quotes, and receipts</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Document
        </button>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Left Sidebar - List of Invoices */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">All Documents</span>
            <span className="text-xs text-gray-400">{invoices.length} items</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400 font-medium">Loading...</div>
            ) : invoices.length === 0 ? (
              <div className="p-4 text-center text-gray-400 font-medium">No documents found.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInvoice?.id === invoice.id ? 'bg-gold-50 border-l-4 border-gold-600' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#111111]">{invoice.customer || 'Unknown Customer'}</span>
                      <span className="font-bold text-gold-600">GH₵ {typeof invoice.total === 'number' ? invoice.total.toFixed(2) : invoice.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{invoice.invoiceNumber} • {invoice.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                        invoice.type === 'quote' ? 'bg-purple-50 text-purple-700' :
                        invoice.type === 'receipt' ? 'bg-emerald-50 text-emerald-700' :
                        invoice.type === 'refund' ? 'bg-gray-50 text-gray-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {invoice.type || 'Invoice'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Invoice Detail / Preview */}
        <div className="flex-1 flex flex-col bg-[#F3F4F6] overflow-y-auto">
          {selectedInvoice ? (
            <div className="p-8">
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Edit</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Send</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Print/PDF</button>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors">Record Payment</button>
                  <button 
                    onClick={() => handleDelete(selectedInvoice.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Invoice Paper Paper */}
              <div className="bg-white max-w-4xl mx-auto p-12 rounded-lg shadow-xl relative min-h-[800px]">
                {/* Status Badge */}
                <div className="absolute top-0 right-0 m-6">
                  <span className={`px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${
                    selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    selectedInvoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>

                {/* Company Header */}
                <div className="flex justify-between mb-12">
                  <div>
                    <h1 className="text-3xl font-serif font-black text-[#111111]">P-BURNS</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Enterprise</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Sefwi Dwirase Western North</p>
                      <p>Ghana</p>
                      <p>0537749190</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-4xl font-serif font-bold text-[#111111] capitalize">{selectedInvoice.type || 'Invoice'}</h2>
                    <p className="text-sm font-bold text-gray-600 mt-1"># {selectedInvoice.invoiceNumber}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <p><span className="font-bold text-gray-700">Date:</span> {selectedInvoice.date}</p>
                      <p><span className="font-bold text-gray-700">Due Date:</span> {selectedInvoice.date}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
                  <p className="text-lg font-bold text-[#111111]">{selectedInvoice.customer}</p>
                </div>

                {/* Table */}
                <div className="mb-12">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Item & Description</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-widest">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-widest">Rate</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-widest">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.items ? selectedInvoice.items.map((item: any, index: number) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-[#111111]">{item.name}</td>
                          <td className="px-6 py-4 text-right">{item.quantity}</td>
                          <td className="px-6 py-4 text-right">GH₵ {typeof item.rate === 'number' ? item.rate.toFixed(2) : item.rate}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#111111]">GH₵ {(item.quantity * item.rate).toFixed(2)}</td>
                        </tr>
                      )) : (
                        <tr className="text-sm text-gray-700">
                          <td className="px-6 py-4">1</td>
                          <td className="px-6 py-4 font-medium text-[#111111]">Product / Service from Order</td>
                          <td className="px-6 py-4 text-right">1.00</td>
                          <td className="px-6 py-4 text-right">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#111111]">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                  <div className="w-1/3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Sub Total</span>
                      <span className="font-bold text-[#111111]">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</span>
                    </div>
                    <div className="flex justify-between text-lg font-serif font-bold border-t border-gray-100 pt-2">
                      <span className="text-[#111111]">Total</span>
                      <span className="text-gold-600">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</span>
                    </div>
                    <div className="flex justify-between text-sm bg-gray-50 p-2 font-bold text-[#111111]">
                      <span>Balance Due</span>
                      <span>GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</h4>
                  <p className="text-xs text-gray-500">{selectedInvoice.notes || 'Thanks for your business.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
              Select a document to view details
            </div>
          )}
        </div>
      </div>

      {/* Create Document Modal (Slide-in from right) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsCreateModalOpen(false)}></div>
          
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Create New Document</h3>
                <p className="text-xs text-gray-500 mt-1">Invoice, Quote, or Receipt</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-[#111111] transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Document Type</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                  >
                    <option value="invoice">Invoice</option>
                    <option value="quote">Quotation</option>
                    <option value="receipt">Payment Receipt</option>
                    <option value="refund">Refund Receipt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Name</label>
                <input 
                  type="text" 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Items Table */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Items</label>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required 
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                        placeholder="Item name"
                      />
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        required 
                        min="1"
                        className="w-20 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                      />
                      <input 
                        type="number" 
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                        required 
                        min="0"
                        step="0.01"
                        className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                        placeholder="Rate"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        disabled={items.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={handleAddItem}
                  className="mt-2 text-sm font-bold text-gold-600 hover:text-gold-700"
                >
                  + Add Item
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="Notes or terms..."
                />
              </div>

              {/* Total Preview */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Estimated Total:</span>
                <span className="text-xl font-serif font-bold text-gold-600">GH₵ {calculateTotal().toFixed(2)}</span>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
