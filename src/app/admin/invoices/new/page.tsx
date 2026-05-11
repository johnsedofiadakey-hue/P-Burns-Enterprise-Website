'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewInvoicePage() {
  const [customer, setCustomer] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('unpaid')
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0 }])
  const router = useRouter()

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0)
  const total = subtotal // Assuming no tax/discount for now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ customer, date, status, items, total })
    alert('Invoice created (mock)')
    router.push('/admin/invoices')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <button 
                type="button"
                onClick={addItem}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      required 
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" 
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                      required 
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="w-24 text-right text-sm font-medium text-gray-900">
                    GH₵ {(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900 text-sm"
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-emerald-600">GH₵ {total.toFixed(2)}</span>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button"
              onClick={() => router.push('/admin/invoices')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
