'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CartIcon from '@/components/CartIcon'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <header className="bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo-transparent.png" alt="P-Burns Logo" width={120} height={40} className="object-contain" style={{ height: 'auto' }} />
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Shop</Link>
            <Link href="/pre-order" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Pre-Order</Link>
            <Link href="/services" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Services</Link>
            <Link href="/projects" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Projects</Link>
            <Link href="/contact" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-6">
            <Link href="/wishlist" className="text-[#111111] hover:text-gold-600 transition-colors" aria-label="Wishlist">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
            <CartIcon />
            
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#111111] hover:text-gold-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Shop</Link>
            <Link href="/pre-order" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Pre-Order</Link>
            <Link href="/services" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/projects" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Projects</Link>
            <Link href="/contact" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-gold-600 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
