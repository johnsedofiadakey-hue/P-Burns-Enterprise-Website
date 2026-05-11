import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero_showroom.png"
            alt="Showroom"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-start justify-center min-h-[600px]">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Premium Ceramics & Doors
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mb-8">
            Quality products for your construction and home improvement projects. Sourced directly from top manufacturers.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/shop" 
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
            >
              Shop Now
            </Link>
            <Link 
              href="/services" 
              className="px-6 py-3 bg-white text-emerald-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

          {/* About Us */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative z-10 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About P-Burns Enterprise</h2>
            <p className="text-gray-600">
              We are a premier retail and service company in Ghana, specializing in high-quality ceramics, doors, and home items. 
              We also provide professional windows installation services and handle bulk supply contracts for construction projects.
            </p>
          </section>

          {/* Featured Categories */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ceramics */}
          <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-gray-400">Ceramics Image</div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ceramics</h3>
              <p className="text-gray-500 text-sm mb-4">High-quality floor and wall tiles.</p>
              <Link href="/shop/ceramics" className="text-emerald-600 font-medium hover:text-emerald-700">Explore &rarr;</Link>
            </div>
          </div>

          {/* Doors */}
          <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-gray-400">Doors Image</div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Doors</h3>
              <p className="text-gray-500 text-sm mb-4">Security and wooden doors for all needs.</p>
              <Link href="/shop/doors" className="text-emerald-600 font-medium hover:text-emerald-700">Explore &rarr;</Link>
            </div>
          </div>

          {/* Home Items */}
          <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-gray-400">Home Items Image</div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Items</h3>
              <p className="text-gray-500 text-sm mb-4">General items for your home and office.</p>
              <Link href="/shop/home-items" className="text-emerald-600 font-medium hover:text-emerald-700">Explore &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Windows Installation</h3>
            <p className="text-gray-500 text-sm">Professional supply and installation of quality windows.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v12"></path></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">General Contracts</h3>
            <p className="text-gray-500 text-sm">Bulk supply contracts for construction projects.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pre-Orders</h3>
            <p className="text-gray-500 text-sm">Order items directly from China shipments.</p>
          </div>
        </div>
      </section>

      {/* Pre-Order Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-emerald-600 text-white p-8 rounded-lg flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">China Import Pre-Orders</h2>
            <p className="text-emerald-100">Secure your items from our upcoming shipments at better rates.</p>
          </div>
          <Link 
            href="/pre-order" 
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-emerald-600 font-medium rounded-md hover:bg-emerald-50 transition-colors"
          >
            View Pre-Order Items
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose P-Burns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">We source only the best materials from trusted manufacturers.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Sourcing</h3>
              <p className="text-gray-600 text-sm">No middlemen. We bring the value directly to you.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Service</h3>
              <p className="text-gray-600 text-sm">Years of experience in the construction supply industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 h-48 flex items-center justify-center mb-4">
              <div className="text-gray-400">Product Image</div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Premium Ceramic Tile</h3>
            <p className="text-emerald-600 font-bold mt-1">GH₵ 120.00</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 h-48 flex items-center justify-center mb-4">
              <div className="text-gray-400">Product Image</div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Luxury Security Door</h3>
            <p className="text-emerald-600 font-bold mt-1">GH₵ 1,500.00</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 h-48 flex items-center justify-center mb-4">
              <div className="text-gray-400">Product Image</div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Elegant Hand Basin</h3>
            <p className="text-emerald-600 font-bold mt-1">GH₵ 350.00</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 h-48 flex items-center justify-center mb-4">
              <div className="text-gray-400">Product Image</div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Modern Door Lock</h3>
            <p className="text-emerald-600 font-bold mt-1">GH₵ 85.00</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm mb-4">"The quality of the ceramics I bought from P-Burns was exceptional. My house looks amazing."</p>
              <p className="font-semibold text-gray-900">- Kwesi Mensah</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm mb-4">"Great customer service and fast delivery. I highly recommend them for any construction project."</p>
              <p className="font-semibold text-gray-900">- Abena Osei</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
