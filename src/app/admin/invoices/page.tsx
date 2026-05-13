'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import Link from 'next/link'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  
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
      if (fetchedInvoices.length > 0) {
        setSelectedInvoice(fetchedInvoices[0]); // Select first one by default
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
      setInvoices(invoices.filter(i => i.id !== id));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(invoices.length > 1 ? invoices[0] : null);
      }
      showToast("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showToast("Error deleting invoice", "error");
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
        <Link 
          href="/admin/invoices/new"
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Invoice
        </Link>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Left Sidebar - List of Invoices */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">All Invoices</span>
            <span className="text-xs text-gray-400">{invoices.length} items</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400 font-medium">Loading...</div>
            ) : invoices.length === 0 ? (
              <div className="p-4 text-center text-gray-400 font-medium">No invoices found.</div>
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
                        invoice.status === 'paid' ? 'bg-green-50 text-green-700' : 
                        invoice.status === 'partial' ? 'bg-yellow-50 text-yellow-700' : 
                        'bg-red-50 text-red-700'
                      }`}>
                        {invoice.status}
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
                {/* Draft Badge or Status */}
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
                    <h2 className="text-4xl font-serif font-bold text-[#111111]">Invoice</h2>
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
                      {/* We mock the items if not present in invoice */}
                      <tr className="text-sm text-gray-700">
                        <td className="px-6 py-4">1</td>
                        <td className="px-6 py-4 font-medium text-[#111111]">Product / Service from Order</td>
                        <td className="px-6 py-4 text-right">1.00</td>
                        <td className="px-6 py-4 text-right">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</td>
                        <td className="px-6 py-4 text-right font-bold text-[#111111]">GH₵ {typeof selectedInvoice.total === 'number' ? selectedInvoice.total.toFixed(2) : selectedInvoice.total}</td>
                      </tr>
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
                  <p className="text-xs text-gray-500">Thanks for your business.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
              Select an invoice to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
