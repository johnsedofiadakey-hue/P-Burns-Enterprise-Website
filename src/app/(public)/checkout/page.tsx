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
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Secure Checkout</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Customer Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
                >
                  Pay with Paystack
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 h-fit">
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                    <span className="font-bold text-[#111111]">GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111111]">GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#111111]">GH₵ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 my-4 pt-4 flex justify-between font-black text-[#111111] text-lg uppercase">
                  <span>Total</span>
                  <span className="text-gold-600">GH₵ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
