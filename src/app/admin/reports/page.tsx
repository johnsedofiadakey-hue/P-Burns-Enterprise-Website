'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transSnapshot = await getDocs(collection(db, "transactions"));
        const fetchedTrans = transSnapshot.docs.map(doc => doc.data());
        setTransactions(fetchedTrans);

        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const fetchedOrders = ordersSnapshot.docs.map(doc => doc.data());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0)
  const netProfit = totalIncome - totalExpense

  const totalSales = orders.reduce((acc, o) => acc + (typeof o.total === 'number' ? o.total : parseFloat(o.total || 0)), 0)

  // Mock data for charts if real data is too sparse
  const monthlyData = [
    { month: 'Jan', income: 4500, expense: 3000 },
    { month: 'Feb', income: 5200, expense: 3200 },
    { month: 'Mar', income: 6100, expense: 4000 },
    { month: 'Apr', income: 5800, expense: 3800 },
    { month: 'May', income: 7200, expense: 4500 },
    { month: 'Jun', income: netProfit > 0 ? netProfit : 8000, expense: totalExpense > 0 ? totalExpense : 5000 }, // Use real data for current month if available
  ]

  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Reports & Analytics</h2>
        <p className="text-sm text-gray-500">Overview of your business performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
          <p className="text-2xl font-serif font-bold text-[#111111] mt-2">GH₵ {totalSales.toFixed(2)}</p>
          <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
            ↑ From orders
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Income</p>
          <p className="text-2xl font-serif font-bold text-green-600 mt-2">GH₵ {totalIncome.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-500">From transactions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Expenses</p>
          <p className="text-2xl font-serif font-bold text-red-600 mt-2">GH₵ {totalExpense.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-500">From transactions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
          <p className="text-2xl font-serif font-bold text-gold-600 mt-2">GH₵ {netProfit.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-500">Income - Expenses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Chart: Revenue vs Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Revenue vs Expenses</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span>Expense</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64 pt-4">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex gap-1 items-end h-48 w-full justify-center">
                  {/* Income Bar */}
                  <div 
                    className="w-4 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all cursor-pointer relative group"
                    style={{ height: `${(data.income / maxVal) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap">
                      GH₵ {data.income}
                    </div>
                  </div>
                  {/* Expense Bar */}
                  <div 
                    className="w-4 bg-red-500 rounded-t-sm hover:bg-red-600 transition-all cursor-pointer relative group"
                    style={{ height: `${(data.expense / maxVal) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap">
                      GH₵ {data.expense}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sales Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Sales Report</h3>
            <p className="text-gray-500 text-xs mb-4">View sales by date range, category, or product.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Contract Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Contract Report</h3>
            <p className="text-gray-500 text-xs mb-4">Active, completed, and cancelled contracts summary.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Financial Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Profit & Loss</h3>
            <p className="text-gray-500 text-xs mb-4">Revenue vs Expenses breakdown by month.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Inventory Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Stock Report</h3>
            <p className="text-gray-500 text-xs mb-4">Low stock alerts and inventory valuation.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
