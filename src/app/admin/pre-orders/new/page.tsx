'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPreOrderPage() {
  const [customer, setCustomer] = useState('')
  const [supplier, setSupplier] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [status, setStatus] = useState('ordered')
  const [total, setTotal] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ customer, supplier, arrivalDate, status, total })
    alert('Pre-order created (mock)')
    router.push('/admin/pre-orders')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Pre-Order</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input 
              type="text" 
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <input 
              type="text" 
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Arrival Date</label>
            <input 
              type="date" 
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ordered">Ordered</option>
              <option value="in_transit">In Transit</option>
              <option value="arrived">Arrived</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount (GH₵)</label>
            <input 
              type="number" 
              step="0.01"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button"
              onClick={() => router.push('/admin/pre-orders')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save Pre-Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
