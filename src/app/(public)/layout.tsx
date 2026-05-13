import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default theme
  let theme = { primary: '#B68D40', secondary: '#111111', background: '#FAFAFA' }
  
  // Read theme from file
  try {
    const themeFilePath = path.join(process.cwd(), 'src/data/theme.json')
    if (fs.existsSync(themeFilePath)) {
      const data = fs.readFileSync(themeFilePath, 'utf8')
      theme = JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to read theme', error)
  }

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ 
        backgroundColor: theme.background,
        '--color-gold-500': theme.primary,
        '--color-gold-600': theme.primary,
        '--color-charcoal-950': theme.secondary,
        '--color-charcoal-900': theme.secondary,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-[#111111]/80 backdrop-blur-md border-b border-[#1A1A1A] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-black text-white uppercase tracking-tight">
                P-Burns<span className="text-gold-500">.</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-gold-500 transition-colors">Home</Link>
              <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-gold-500 transition-colors">Shop</Link>
              <Link href="/pre-order" className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-gold-500 transition-colors">Pre-Order</Link>
              <Link href="/services" className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-gold-500 transition-colors">Services</Link>
              <Link href="/contact" className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-gold-500 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors">Admin</Link>
              <Link href="/cart" className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white mt-auto border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">P-Burns<span className="text-gold-500">.</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed">Premium ceramics, luxury doors, and enterprise construction supplies sourced directly from top global manufacturers.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/shop/ceramics" className="hover:text-white transition-colors">Ceramics</Link></li>
                <li><Link href="/shop/doors" className="hover:text-white transition-colors">Doors</Link></li>
                <li><Link href="/shop/home-items" className="hover:text-white transition-colors">Home Items</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>Email: info@pburns.com</li>
                <li>Phone: +233 ...</li>
                <li>Address: Accra, Ghana</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1A1A1A] mt-16 pt-8 text-center text-xs uppercase tracking-wider text-gray-600">
            &copy; {new Date().getFullYear()} P-Burns Enterprise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
