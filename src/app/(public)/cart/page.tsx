'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Mock cart items
const initialCartItems = [
  { id: '1', name: 'Ceramic Tile A', price: 120.00, quantity: 2, image: '/placeholder.png' },
  { id: '2', name: 'Wooden Door B', price: 450.00, quantity: 1, image: '/placeholder.png' },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryFee = 50.00 // Mock delivery fee
  const total = subtotal + deliveryFee

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/shop" className="text-emerald-600 font-medium hover:text-emerald-700">Go shopping &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0 flex items-center justify-center rounded">
                  <div className="text-gray-400 text-xs">Image</div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">GH₵ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >-</button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 text-sm hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
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
            <Link 
              href="/checkout"
              className="w-full mt-6 block text-center py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
