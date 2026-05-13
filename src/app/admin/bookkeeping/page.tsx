'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'

export default function BookkeepingPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Form State
  const [type, setType] = useState('income')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const fetchedTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date descending
      fetchedTransactions.sort((a: any, b: any) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Error fetching transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions(transactions.filter(t => t.id !== id));
      showToast("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showToast("Error deleting transaction", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docData = {
        type,
        category,
        description,
        amount: parseFloat(amount),
        date,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "transactions"), docData);
      
      showToast('Transaction added successfully!');
      setIsAddModalOpen(false);
      // Reset form
      setType('income');
      setCategory('');
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Refresh list
      fetchTransactions();
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      showToast('Error adding transaction: ' + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0)
  const netProfit = totalIncome - totalExpense

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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Bookkeeping</h2>
          <p className="text-sm text-gray-700">Track your income and expenses</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Income</p>
          <p className="text-3xl font-serif font-bold text-green-600 mt-2">GH₵ {totalIncome.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-700 flex items-center gap-1">
            <span className="text-green-500 font-bold">↑</span> Money coming in
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Expenses</p>
          <p className="text-3xl font-serif font-bold text-red-600 mt-2">GH₵ {totalExpense.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-700 flex items-center gap-1">
            <span className="text-red-500 font-bold">↓</span> Money going out
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
          <p className="text-3xl font-serif font-bold text-gold-600 mt-2">GH₵ {netProfit.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-700 flex items-center gap-1">
            <span className={netProfit >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
              {netProfit >= 0 ? "↑" : "↓"}
            </span> 
            Overall balance
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Recent Transactions</span>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">Loading transactions...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">No transactions found. Add one!</td>
              </tr>
            ) : transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{t.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${
                    t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{t.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                  <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {t.type === 'income' ? '+' : '-'} GH₵ {typeof t.amount === 'number' ? t.amount.toFixed(2) : t.amount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button 
                    onClick={() => handleDelete(t.id)}
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

      {/* Add Transaction Modal (Slide-in from right) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add Transaction</h3>
                <p className="text-xs text-gray-700 mt-1">Record a new income or expense</p>
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Type</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="type" 
                      value="income" 
                      checked={type === 'income'} 
                      onChange={(e) => setType(e.target.value)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Income</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="type" 
                      value="expense" 
                      checked={type === 'expense'} 
                      onChange={(e) => setType(e.target.value)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Expense</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Sales, Rent, Supplies"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Invoice #123 payment"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Amount (GH₵)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="0.00"
                />
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
                {saving ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
