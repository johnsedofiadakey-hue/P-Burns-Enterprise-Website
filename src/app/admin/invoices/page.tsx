'use client'

import { useState, useEffect } from 'react'
import { db, storage } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Image from 'next/image'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [docType, setDocType] = useState('invoice') // invoice, quote, receipt, refund
  const [status, setStatus] = useState('draft') // draft, paid, partial, unpaid
  const [customer, setCustomer] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([{ name: '', quantity: 1, rate: 0 }])
  const [notes, setNotes] = useState('Thanks for your business.')
  const [discount, setDiscount] = useState(0)
  const [applyTax, setApplyTax] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [settings, setSettings] = useState<any>(null)

  const formatMoney = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

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
    const subTotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const discountAmount = subTotal * (discount / 100);
    const afterDiscount = subTotal - discountAmount;
    const taxAmount = applyTax ? afterDiscount * ((settings?.taxPercentage ?? 15) / 100) : 0;
    return afterDiscount + taxAmount;
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
        customerEmail,
        customerPhone,
        customerAddress,
        date,
        items,
        total,
        discount,
        applyTax,
        notes,
        status: status,
        type: docType,
        updatedAt: new Date().toISOString()
      };
      
      if (isEditing && selectedInvoice) {
        await updateDoc(doc(db, "invoices", selectedInvoice.id), docData);
        showToast('Document updated successfully!');
      } else {
        await addDoc(collection(db, "invoices"), { ...docData, createdAt: new Date().toISOString() });
        showToast('Document created successfully!');
      }
      
      setIsCreateModalOpen(false);
      setIsEditing(false);
      // Reset form
      setCustomer('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomerAddress('');
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

  const handleEdit = () => {
    if (!selectedInvoice) return;
    setIsEditing(true);
    setDocType(selectedInvoice.type || 'invoice');
    setStatus(selectedInvoice.status || 'draft');
    setCustomer(selectedInvoice.customer || '');
    setCustomerEmail(selectedInvoice.customerEmail || '');
    setCustomerPhone(selectedInvoice.customerPhone || '');
    setCustomerAddress(selectedInvoice.customerAddress || '');
    setDate(selectedInvoice.date || '');
    setItems(selectedInvoice.items || [{ name: '', quantity: 1, rate: 0 }]);
    setNotes(selectedInvoice.notes || 'Thanks for your business.');
    setDiscount(selectedInvoice.discount || 0);
    setApplyTax(selectedInvoice.applyTax || false);
    setIsCreateModalOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice) return;
    try {
      const docRef = doc(db, "invoices", selectedInvoice.id);
      await updateDoc(docRef, { status: 'paid' });
      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
      fetchInvoices();
      showToast('Payment recorded successfully!');
    } catch (error) {
      console.error("Error recording payment:", error);
      showToast('Error recording payment', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-paper');
    if (!element || !selectedInvoice) return;
    
    showToast("Opening print dialog...");
    
    // Open a new window with just the invoice content and trigger print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Please allow popups to download PDF", "error");
      return;
    }
    
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(tag => tag.outerHTML)
      .join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${selectedInvoice.invoiceNumber}</title>
          ${styles}
          <style>
            @page { margin: 10mm; size: A4; }
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              #invoice-paper { box-shadow: none !important; border: none !important; margin: 0 !important; max-width: 100% !important; }
            }
          </style>
        </head>
        <body style="background: white;">${element.outerHTML}</body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleConvertInvoice = async () => {
    if (!selectedInvoice) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "invoices", selectedInvoice.id), {
        type: 'invoice',
        invoiceNumber: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      });
      showToast("Quote converted to Invoice!");
      setSelectedInvoice({ ...selectedInvoice, type: 'invoice' });
      fetchInvoices();
    } catch (error) {
      console.error("Error converting quote:", error);
      showToast("Error converting quote", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSharePDF = async (method: 'whatsapp' | 'email') => {
    const element = document.getElementById('invoice-paper');
    if (!element || !selectedInvoice) return;
    
    showToast("Preparing document...");
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });
      const data = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `invoices/${selectedInvoice.invoiceNumber}.pdf`);
      showToast("Uploading to secure storage...");
      const uploadResult = await uploadBytes(storageRef, pdfBlob);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      const message = `Here is your ${selectedInvoice.type || 'document'} (#${selectedInvoice.invoiceNumber}) from P-Burns Enterprise: ${downloadURL}`;
      
      if (method === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else if (method === 'email') {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(selectedInvoice.type || 'Document')} #${selectedInvoice.invoiceNumber}&body=${encodeURIComponent(message)}`;
        window.open(mailtoUrl, '_blank');
      }
      
      showToast("Share link generated!");
    } catch (error) {
      console.error("Error sharing PDF:", error);
      showToast("Error sharing PDF", "error");
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
          <p className="text-sm text-gray-700">Manage invoices, quotes, and receipts</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Document
        </button>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex flex-col md:flex-row bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        
        {/* Left Sidebar - List of Invoices */}
        <div className={`${selectedInvoice ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-100 flex flex-col`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">All Documents</span>
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
                      <span className="font-bold text-gold-600">GH₵ {formatMoney(invoice.total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-700">
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
        <div className={`${selectedInvoice ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-[#F3F4F6] overflow-y-auto`}>
          {selectedInvoice ? (
            <div className="p-8">
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedInvoice(null)} 
                    className="md:hidden px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button 
                    onClick={handleEdit}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this invoice?')) return;
                      try {
                        const { deleteDoc, doc } = await import('firebase/firestore');
                        await deleteDoc(doc(db, "invoices", selectedInvoice.id));
                        setSelectedInvoice(null);
                        fetchInvoices();
                        showToast("Invoice deleted successfully!");
                      } catch (e: any) {
                        showToast("Error deleting invoice", "error");
                      }
                    }}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => handleSharePDF('whatsapp')}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Send
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Print/PDF
                  </button>
                  {selectedInvoice.type === 'quote' && (
                    <button 
                      onClick={handleConvertInvoice}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Convert to Invoice
                    </button>
                  )}
                  <button 
                    onClick={() => handleSharePDF('email')}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Share Email
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRecordPayment}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Record Payment
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedInvoice.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Invoice Paper */}
              <div id="invoice-paper" className="bg-white max-w-4xl mx-auto p-12 rounded-lg shadow-xl relative min-h-[800px]">
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
                    <div className="mb-2">
                      <Image src="/logo-transparent.png" alt="P-Burns Logo" width={200} height={67} className="object-contain" unoptimized />
                    </div>
                    <div className="text-xs font-bold text-[#111111] mt-2">
                      <p>{settings?.address || 'Sefwi Dwirase Western North'}</p>
                      <p>{settings?.phone || '0537749190'}</p>
                      <p>{settings?.email || 'info@pburns.com'}</p>
                      <p>www.pburns.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-4xl font-serif font-bold text-[#111111] capitalize">{selectedInvoice.type || 'Invoice'}</h2>
                    <p className="text-sm font-bold text-gray-800 mt-1"># {selectedInvoice.invoiceNumber}</p>
                    <div className="text-sm text-gray-700 mt-2">
                      <p><span className="font-bold text-gray-700">Date:</span> {selectedInvoice.date}</p>
                      <p><span className="font-bold text-gray-700">Due Date:</span> {selectedInvoice.date}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</h3>
                  <p className="text-lg font-bold text-[#111111]">{selectedInvoice.customer}</p>
                  {selectedInvoice.customerEmail && <p className="text-sm text-gray-700">{selectedInvoice.customerEmail}</p>}
                  {selectedInvoice.customerPhone && <p className="text-sm text-gray-700">{selectedInvoice.customerPhone}</p>}
                  {selectedInvoice.customerAddress && <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInvoice.customerAddress}</p>}
                </div>

                {/* Table */}
                <div className="mb-12">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-widest">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-widest">Item & Description</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-widest">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-widest">Rate</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-800 uppercase tracking-widest">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedInvoice.items ? selectedInvoice.items.map((item: any, index: number) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-[#111111]">{item.name}</td>
                          <td className="px-6 py-4 text-right">{item.quantity}</td>
                          <td className="px-6 py-4 text-right">GH₵ {formatMoney(item.rate)}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#111111]">GH₵ {formatMoney(item.quantity * item.rate)}</td>
                        </tr>
                      )) : (
                        <tr className="text-sm text-gray-700">
                          <td className="px-6 py-4">1</td>
                          <td className="px-6 py-4 font-medium text-[#111111]">Product / Service from Order</td>
                          <td className="px-6 py-4 text-right">1.00</td>
                          <td className="px-6 py-4 text-right">GH₵ {formatMoney(selectedInvoice.total)}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#111111]">GH₵ {formatMoney(selectedInvoice.total)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                  <div className="w-1/3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-800">
                      <span>Sub Total</span>
                      <span className="font-bold text-[#111111]">GH₵ {
                        selectedInvoice.items ? 
                        formatMoney(selectedInvoice.items.reduce((acc: number, item: any) => acc + (item.quantity * item.rate), 0)) : 
                        formatMoney(selectedInvoice.total)
                      }</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-gray-800">
                        <span>Discount ({selectedInvoice.discount}%)</span>
                        <span className="font-bold text-red-600">-GH₵ {
                          formatMoney(selectedInvoice.items ? 
                          selectedInvoice.items.reduce((acc: number, item: any) => acc + (item.quantity * item.rate), 0) * (selectedInvoice.discount / 100) : 
                          0)
                        }</span>
                      </div>
                    )}
                    {selectedInvoice.applyTax && (
                      <div className="flex justify-between text-gray-800">
                        <span>VAT ({settings?.taxPercentage ?? 15}%)</span>
                        <span className="font-bold text-[#111111]">GH₵ {
                          formatMoney(((selectedInvoice.items ? 
                          selectedInvoice.items.reduce((acc: number, item: any) => acc + (item.quantity * item.rate), 0) * (1 - (selectedInvoice.discount || 0) / 100) : 
                          parseFloat(selectedInvoice.total)) * ((settings?.taxPercentage ?? 15) / 100)))
                        }</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-serif font-bold border-t border-gray-100 pt-2">
                      <span className="text-[#111111]">Total</span>
                      <span className="text-gold-600">GH₵ {formatMoney(selectedInvoice.total)}</span>
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
                  <p className="text-xs text-gray-700">{selectedInvoice.notes || 'Thanks for your business.'}</p>
                </div>

                {/* Bank Details */}
                <div className="border-t border-gray-100 pt-6 mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bank Transfer</h4>
                    {settings ? (
                      <>
                        <p className="text-xs text-gray-700"><span className="font-bold">Bank:</span> {settings.bankName || 'GCB Bank'}</p>
                        <p className="text-xs text-gray-700"><span className="font-bold">Account Name:</span> {settings.accountName || 'P-Burns Enterprise'}</p>
                        <p className="text-xs text-gray-700"><span className="font-bold">Account Number:</span> {settings.accountNumber || 'N/A'}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">Loading...</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">📱 Mobile Money</h4>
                    {settings && settings.momoNumber ? (
                      <>
                        <p className="text-xs text-gray-700"><span className="font-bold">Network:</span> {settings.momoNetwork || 'MTN'}</p>
                        <p className="text-xs text-gray-700"><span className="font-bold">Number:</span> {settings.momoNumber}</p>
                        <p className="text-xs text-gray-700"><span className="font-bold">Name:</span> {settings.momoName || 'P-Burns Enterprise'}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">No MoMo details set</p>
                    )}
                  </div>
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
                <p className="text-xs text-gray-700 mt-1">Invoice, Quote, or Receipt</p>
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial Payment</option>
                  <option value="unpaid">Unpaid</option>
                </select>
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

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Email</label>
                <input 
                  type="email" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Contact</label>
                <input 
                  type="text" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. 0551234567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Customer Address</label>
                <textarea 
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. House No. 123, Accra"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Discount (%)</label>
                  <input 
                    type="number" 
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Apply Tax (15%)</label>
                  <div className="flex items-center h-[50px]">
                    <input 
                      type="checkbox" 
                      checked={applyTax}
                      onChange={(e) => setApplyTax(e.target.checked)}
                      className="w-5 h-5 text-gold-500 border-gray-200 rounded focus:ring-gold-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Add {settings?.taxPercentage ?? 15}% VAT</span>
                  </div>
                </div>
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
                <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">Estimated Total:</span>
                <span className="text-xl font-serif font-bold text-gold-600">GH₵ {formatMoney(calculateTotal())}</span>
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
