'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const mockOrders = [
  { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', date: '2026-05-10', total: 690.00, status: 'pending', email: 'john@example.com', phone: '+233 241234567', address: '123 Street, Accra', items: [
    { id: '1', name: 'Ceramic Tile A', price: 120.00, quantity: 2 },
    { id: '2', name: 'Wooden Door B', price: 450.00, quantity: 1 },
  ]},
]

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id
  const order = mockOrders.find(o => o.id === id)

  if (!order) {
    return <div className="p-6">Order not found</div>
  }

  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/admin/orders" className="text-gold-600 hover:text-gold-700 font-medium">&larr; Back to Orders</Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Order {order.orderNumber}</h2>
              <button 
                onClick={() => alert('Invoice generated')}
                className="text-sm text-gold-600 hover:text-gold-700 font-medium mt-1"
              >
                Generate Invoice
              </button>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer Info</h3>
              <p className="text-gray-900 font-medium">{order.customer}</p>
              <p className="text-gray-600 text-sm">{order.email}</p>
              <p className="text-gray-600 text-sm">{order.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
              <p className="text-gray-600 text-sm">{order.address}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-2 text-sm text-gray-900">{item.name}</td>
                    <td className="py-2 text-sm text-gray-500">GH₵ {item.price.toFixed(2)}</td>
                    <td className="py-2 text-sm text-gray-500">{item.quantity}</td>
                    <td className="py-2 text-sm text-gray-900">GH₵ {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 mt-6 pt-6 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gold-600">GH₵ {order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
