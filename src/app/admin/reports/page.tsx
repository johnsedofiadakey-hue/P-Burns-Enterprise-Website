'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  // Calculate real monthly data from transactions
  const calculateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, income: 0, expense: 0 }));
    
    transactions.forEach(t => {
      const date = t.createdAt ? new Date(t.createdAt) : new Date();
      const monthIndex = date.getMonth();
      const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || 0);
      
      if (t.type === 'income') {
        data[monthIndex].income += amount;
      } else if (t.type === 'expense') {
        data[monthIndex].expense += amount;
      }
    });
    
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonth - i + 12) % 12;
      last6Months.push(data[idx]);
    }
    
    return last6Months;
  };

  const monthlyData = calculateMonthlyData();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Reports & Analytics</h2>
        <p className="text-sm text-gray-700">Overview of your business performance</p>
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
          <div className="mt-2 text-xs text-gray-700">From transactions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Expenses</p>
          <p className="text-2xl font-serif font-bold text-red-600 mt-2">GH₵ {totalExpense.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-700">From transactions</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
          <p className="text-2xl font-serif font-bold text-gold-600 mt-2">GH₵ {netProfit.toFixed(2)}</p>
          <div className="mt-2 text-xs text-gray-700">Income - Expenses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Chart: Revenue vs Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Revenue vs Expenses</h3>
          </div>
          
          <div className="h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#999' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#999' }} />
                  <Tooltip 
                    contentStyle={{ background: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', color: '#B68D40' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sales Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Sales Report</h3>
            <p className="text-gray-700 text-xs mb-4">View sales by date range, category, or product.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Contract Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Contract Report</h3>
            <p className="text-gray-700 text-xs mb-4">Active, completed, and cancelled contracts summary.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Financial Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Profit & Loss</h3>
            <p className="text-gray-700 text-xs mb-4">Revenue vs Expenses breakdown by month.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>

          {/* Inventory Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-2">Stock Report</h3>
            <p className="text-gray-700 text-xs mb-4">Low stock alerts and inventory valuation.</p>
            <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">Generate &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
