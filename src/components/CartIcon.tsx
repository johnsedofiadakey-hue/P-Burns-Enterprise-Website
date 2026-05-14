'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CartIcon() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCount(cart.length)
    }
    
    updateCount()
    window.addEventListener('storage', updateCount)
    window.addEventListener('cart-updated', updateCount)
    
    return () => {
      window.removeEventListener('storage', updateCount)
      window.removeEventListener('cart-updated', updateCount)
    }
  }, [])
  
  return (
    <Link href="/cart" className="relative p-2 text-[#111111] hover:text-gold-600 transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gold-600 rounded-full min-w-[18px]">
          {count}
        </span>
      )}
    </Link>
  )
}
