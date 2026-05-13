'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeContracts: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        const totalSales = orders.reduce((acc, o) => acc + (typeof o.total === 'number' ? o.total : parseFloat(o.total || 0)), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        const contractsSnapshot = await getDocs(collection(db, "contracts"));
        const contracts = contractsSnapshot.docs.map(doc => doc.data());
        const activeContracts = contracts.filter(c => c.status === 'in_progress' || c.status === 'deposit_paid').length;

        setStats({
          totalSales,
          activeContracts,
          pendingOrders
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome to the P-Burns Enterprise Admin Portal</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
          <p className="text-2xl font-serif font-bold text-[#111111] mt-2">
            GH₵ {loading ? '...' : stats.totalSales.toFixed(2)}
          </p>
          <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
            ↑ From orders
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Contracts</p>
          <p className="text-2xl font-serif font-bold text-[#111111] mt-2">
            {loading ? '...' : stats.activeContracts}
          </p>
          <div className="mt-2 text-xs text-blue-600 font-bold">In Progress / Deposit Paid</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Orders</p>
          <p className="text-2xl font-serif font-bold text-gold-600 mt-2">
            {loading ? '...' : stats.pendingOrders}
          </p>
          <div className="mt-2 text-xs text-gray-500">Awaiting processing</div>
        </div>
      </div>

    </div>
  )
}
