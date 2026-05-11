'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePaystackPayment } from 'react-paystack'

// Mock cart data (should be shared or fetched)
const mockCartItems = [
  { id: '1', name: 'Ceramic Tile A', price: 120.00, quantity: 2 },
  { id: '2', name: 'Wooden Door B', price: 450.00, quantity: 1 },
]

export default function CheckoutPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const router = useRouter()

  const subtotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryFee = 50.00
  const total = subtotal + deliveryFee

  // Paystack configuration
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: total * 100, // Paystack expects amount in pesewas (or kobo)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = (reference: any) => {
    console.log(reference)
    alert('Payment successful! Reference: ' + reference.reference)
    // Here you would save the order to the database via API
    router.push('/checkout/success')
  }

  const onClose = () => {
    alert('Payment closed')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !phone || !address) {
      alert('Please fill in all fields')
      return
    }
    initializePayment(onSuccess, onClose)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required 
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
              >
                Pay with Paystack
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {mockCartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span>GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>GH₵ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>GH₵ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
