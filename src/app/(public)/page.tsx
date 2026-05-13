import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#FAFAFA]">
      
      {/* Premium Hero Section */}
      <section className="relative bg-[#111111] text-white h-[85vh] min-h-[650px] flex items-center">
        {/* Background Image with Deep Gradient Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-[#1A1A1A]/40 z-10" />
          <Image
            src="/hero_showroom.png"
            alt="P-Burns Enterprise Showroom"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              Quality First
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white">
              Elevate Your Space with <span className="text-gold-500">Premium Materials.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10 leading-relaxed font-light border-l-2 border-gold-500 pl-6">
              High-grade ceramics, luxury doors, and enterprise construction supplies sourced directly from top global manufacturers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/shop" 
                className="px-8 py-4 bg-gold-600 text-white font-bold rounded-full hover:bg-gold-500 shadow-lg shadow-gold-900/20 transition-all active:scale-95 text-center flex items-center justify-center gap-2 group"
              >
                Explore Collection
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <Link 
                href="/services" 
                className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:bg-white/5 hover:border-gold-500 transition-all active:scale-95 text-center"
              >
                Request Enterprise Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us (Elevated Gold Card Design) */}
      <section className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-24">
        <div className="bg-white rounded-3xl shadow-2xl shadow-charcoal-900/10 border-t-4 border-gold-500 p-10 md:p-16 text-center relative overflow-hidden">
          {/* Subtle logo monogram watermark in background */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <span className="text-[200px] font-black text-charcoal-900 leading-none">PB</span>
          </div>
          
          <div className="relative z-10">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Our Heritage</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-950 mb-6">Built on Quality & Trust</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              P-Burns Enterprise is Ghana's premier destination for high-quality building finishing materials. From luxury ceramics to robust security doors, we handle individual home improvements and large-scale bulk supply contracts with unmatched professional installation services.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Curation</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Our Collections</h2>
              <p className="text-gray-400 mt-2 text-lg">Meticulously sourced materials for visionary projects.</p>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-gold-500 font-bold hover:text-gold-400 transition-colors uppercase text-sm tracking-wider group">
              View All Categories 
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Category Card 1 */}
            <Link href="/shop/ceramics" className="group flex flex-col hover:-translate-y-2 transition-all duration-500 md:col-span-2">
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src="/category_ceramics.png"
                  alt="Premium Ceramics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-60"></div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Premium Ceramics</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">High-durability floor and wall tiles crafted for modern aesthetics.</p>
                <span className="text-gold-500 font-bold group-hover:text-gold-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Explore Range <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/shop/doors" className="group flex flex-col hover:-translate-y-2 transition-all duration-500">
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src="/category_doors.png"
                  alt="Security & Doors"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-60"></div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Security & Doors</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">Uncompromising security meets elegant wooden and steel finishes.</p>
                <span className="text-gold-500 font-bold group-hover:text-gold-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Explore Range <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/shop/home-items" className="group flex flex-col hover:-translate-y-2 transition-all duration-500">
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src="/category_home_items.png"
                  alt="Home Accessories"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-60"></div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Home Accessories</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">Fixtures, basins, and finishing items to complete your projects.</p>
                <span className="text-gold-500 font-bold group-hover:text-gold-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Explore Range <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-Order Banner (Premium Dark/Gold Design) */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-[#111111] shadow-2xl rounded-3xl border border-[#1A1A1A]">
            {/* Subtle Gold accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"></div>
            
            <div className="relative z-10 px-8 py-20 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left">
                <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Direct Sourcing</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">China Import Pre-Orders</h2>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                  Bypass the markup. Secure your building materials directly from our upcoming international shipments and lock in enterprise wholesale rates.
                </p>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link 
                  href="/pre-order" 
                  className="w-full lg:w-auto inline-flex items-center justify-center px-10 py-5 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/40"
                >
                  View Next Shipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Services */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Solutions</span>
            <h2 className="text-4xl font-serif font-bold text-[#111111] mb-6">Professional Services</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mb-8"></div>
            <p className="text-xl text-[#555555]">Beyond retail, we provide end-to-end solutions for construction and home finishing projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Service 1 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-gold-50 transition-colors duration-300 border border-gray-100">
                <svg className="w-10 h-10 text-[#111111] group-hover:text-gold-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-4 uppercase tracking-wide">Bulk Sourcing</h3>
              <p className="text-[#555555] leading-relaxed text-sm">Dedicated supply lines for large-scale construction projects, ensuring timely delivery of high-volume materials.</p>
            </div>

            {/* Service 2 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-gold-50 transition-colors duration-300 border border-gray-100">
                <svg className="w-10 h-10 text-[#111111] group-hover:text-gold-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-4 uppercase tracking-wide">Expert Installation</h3>
              <p className="text-[#555555] leading-relaxed text-sm">Professional fitting and installation of windows, doors, and complex architectural glass setups by trained experts.</p>
            </div>

            {/* Service 3 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-gold-50 transition-colors duration-300 border border-gray-100">
                <svg className="w-10 h-10 text-[#111111] group-hover:text-gold-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-4 uppercase tracking-wide">Quality Assurance</h3>
              <p className="text-[#555555] leading-relaxed text-sm">Rigorous checks on all imported goods to ensure every tile and fitting meets top-tier structural standards.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
