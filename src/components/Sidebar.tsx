'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Sidebar({ email }: { email?: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊', category: 'Operations' },
    { href: '/admin/products', label: 'Products', icon: '📦', category: 'Operations' },
    { href: '/admin/categories', label: 'Categories', icon: '📁', category: 'Operations' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒', category: 'Operations' },
    { href: '/admin/pre-orders', label: 'Pre-Orders', icon: '⏳', category: 'Operations' },
    { href: '/admin/services', label: 'Services', icon: '🛠️', category: 'Operations' },
    { href: '/admin/suppliers', label: 'Suppliers', icon: '🤝', category: 'Operations' },
    
    { href: '/admin/invoices', label: 'Invoices', icon: '🧾', category: 'Finance' },
    { href: '/admin/bookkeeping', label: 'Bookkeeping', icon: '💰', category: 'Finance' },
    
    { href: '/admin/customers', label: 'Customers', icon: '👥', category: 'Management' },
    { href: '/admin/contracts', label: 'Contracts', icon: '📄', category: 'Management' },
    { href: '/admin/reports', label: 'Reports', icon: '📈', category: 'Management' },
    { href: '/admin/users', label: 'Users', icon: '👤', category: 'Management' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️', category: 'Management' },
  ]

  const categories = ['Operations', 'Finance', 'Management']

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111111] text-white rounded-md"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#111111] text-white flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static h-screen`}>
        <div className="p-6 border-b border-[#1A1A1A]">
          <Image src="/logo.png" alt="P-Burns Logo" width={150} height={50} className="object-contain invert brightness-0" />
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 px-4">{category}</h3>
              <div className="space-y-1">
                {links.filter(link => link.category === category).map(link => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === link.href ? 'bg-gold-500 text-[#111111] font-bold' : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1A1A1A]">
          <div className="text-sm truncate text-gray-400 px-4">{email}</div>
        </div>
      </aside>

      {/* Overlay for mobile when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
