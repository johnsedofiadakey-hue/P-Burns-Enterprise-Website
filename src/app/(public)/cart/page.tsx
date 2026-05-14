'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Mock cart items
const initialCartItems = [
  { id: '1', name: 'Ceramic Tile A', price: 120.00, quantity: 2, image: '/category_ceramics.png' },
  { id: '2', name: 'Wooden Door B', price: 450.00, quantity: 1, image: '/category_doors.png' },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
      window.dispatchEvent(new Event('cart-updated'))
    }
  }, [cartItems, isMounted])

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
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Your Order</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-12">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
            <p className="text-gray-500 mb-6 text-lg">Your cart is empty.</p>
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 flex gap-6 items-center">
                  <div className="relative w-28 h-28 overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#111111]">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Premium Quality</p>
                      <p className="text-gold-600 font-bold mt-2">GH₵ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center md:flex-col md:items-end md:justify-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >-</button>
                        <span className="px-4 py-1.5 text-sm font-bold text-[#111111]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm font-bold uppercase hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 h-fit">
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Summary</h2>
              <div className="space-y-4 text-sm">
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
              <Link 
                href="/checkout"
                className="w-full mt-8 block text-center py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
