'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const mockInvoices = [
  { id: '1', invoiceNumber: 'INV-001', customer: 'John Doe', date: '2026-05-10', amount: 690.00, status: 'paid', items: [
    { id: '1', name: 'Ceramic Tile A', price: 120.00, quantity: 2 },
    { id: '2', name: 'Wooden Door B', price: 450.00, quantity: 1 },
  ]},
]

export default function InvoiceDetailPage() {
  const params = useParams()
  const id = params.id
  const invoice = mockInvoices.find(i => i.id === id)

  if (!invoice) {
    return <div className="p-6">Invoice not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/invoices" className="text-emerald-600 hover:text-emerald-700 font-medium">&larr; Back to Invoices</Link>
        <button 
          onClick={() => alert('Downloading PDF...')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Download PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-500">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-gray-900">P-Burns Enterprise</h2>
            <p className="text-gray-500 text-sm">Accra, Ghana</p>
            <p className="text-gray-500 text-sm">info@pburns.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 border-t border-b border-gray-100 py-6">
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase">Billed To</h3>
            <p className="text-gray-900 font-medium">{invoice.customer}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Details</h3>
            <p className="text-gray-900"><span className="text-gray-500">Date:</span> {invoice.date}</p>
            <p className="text-gray-900"><span className="text-gray-500">Status:</span> 
              <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200 mb-8">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map(item => (
              <tr key={item.id}>
                <td className="py-3 text-sm text-gray-900">{item.name}</td>
                <td className="py-3 text-sm text-gray-500 text-right">GH₵ {item.price.toFixed(2)}</td>
                <td className="py-3 text-sm text-gray-500 text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-gray-900 text-right">GH₵ {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-500">Amount Due</p>
            <p className="text-3xl font-bold text-emerald-600">GH₵ {invoice.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
