'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeContracts: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])

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

        const productsSnapshot = await getDocs(collection(db, "products"));
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const lowStock = products.filter(p => (typeof (p as any).stock === 'number' ? (p as any).stock : parseInt((p as any).stock || 0)) < 10);
        setLowStockProducts(lowStock);

        setRecentOrders(orders.slice(0, 5));

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Dashboard</h2>
          <p className="text-sm text-gray-700">Welcome to the P-Burns Enterprise Admin Portal</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gold-600 transition-colors">
            + Add Product
          </Link>
          <Link href="/admin/invoices" className="px-4 py-2 bg-white border border-gray-200 text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors">
            New Invoice
          </Link>
        </div>
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
          <div className="mt-2 text-xs text-gray-700">Awaiting processing</div>
        </div>
      </div>

      {/* Grid for Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-bold text-[#111111]">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-gold-600 hover:text-gold-700 uppercase">View All</Link>
          </div>
          {loading ? (
            <div className="text-sm text-gray-700">Loading orders...</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-sm text-gray-500">No orders found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-[#111111]">{order.customerName || order.customer}</div>
                    <div className="text-xs text-gray-500">
                      {order.date || (typeof order.createdAt === 'string' ? order.createdAt.split('T')[0] : order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#111111]">GH₵ {parseFloat(order.total).toFixed(2)}</div>
                    <div className={`text-xs font-bold capitalize ${
                      order.status === 'completed' ? 'text-green-600' : 
                      order.status === 'pending' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`}>{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-serif font-bold text-[#111111] mb-4">Low Stock Alerts</h3>
        {loading ? (
          <div className="text-sm text-gray-700">Loading alerts...</div>
        ) : lowStockProducts.length === 0 ? (
          <div className="text-sm text-green-600 font-bold">✨ All products are well stocked!</div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <div className="text-sm font-bold text-[#111111]">{product.name}</div>
                  <div className="text-xs text-gray-500">Category: {product.category}</div>
                </div>
                <div className="text-sm font-bold text-red-600">
                  {product.stock} left
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
