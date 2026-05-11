'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const mockCustomers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+233 241234567', type: 'Retail', orders: [
    { id: '1', orderNumber: 'ORD-001', date: '2026-05-10', total: 690.00, status: 'pending' },
  ]},
]

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params.id
  const customer = mockCustomers.find(c => c.id === id)

  if (!customer) {
    return <div className="p-6">Customer not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/customers" className="text-emerald-600 hover:text-emerald-700 font-medium">&larr; Back to Customers</Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
            customer.type === 'Retail' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {customer.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-gray-900">{customer.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-gray-900">{customer.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        {customer.orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customer.orders.map(order => (
                <tr key={order.id}>
                  <td className="py-2 text-sm font-medium text-emerald-600">
                    <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                  </td>
                  <td className="py-2 text-sm text-gray-500">{order.date}</td>
                  <td className="py-2 text-sm text-gray-500">GH₵ {order.total.toFixed(2)}</td>
                  <td className="py-2 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
