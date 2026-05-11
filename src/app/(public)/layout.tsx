import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-emerald-900">
                P-Burns Enterprise
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-emerald-900">Home</Link>
              <Link href="/shop" className="text-gray-600 hover:text-emerald-900">Shop</Link>
              <Link href="/pre-order" className="text-gray-600 hover:text-emerald-900">Pre-Order</Link>
              <Link href="/services" className="text-gray-600 hover:text-emerald-900">Services</Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-900">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900">Admin</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">P-Burns Enterprise</h3>
              <p className="text-emerald-200 text-sm">Quality ceramics, doors, and home items.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li><Link href="/shop/ceramics" className="hover:text-white">Ceramics</Link></li>
                <li><Link href="/shop/doors" className="hover:text-white">Doors</Link></li>
                <li><Link href="/shop/home-items" className="hover:text-white">Home Items</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li>Email: info@pburns.com</li>
                <li>Phone: +233 ...</li>
                <li>Address: Accra, Ghana</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-sm text-emerald-300">
            &copy; {new Date().getFullYear()} P-Burns Enterprise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
