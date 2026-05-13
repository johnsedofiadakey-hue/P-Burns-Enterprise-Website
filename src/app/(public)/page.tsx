import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function Home() {
  // Default stats
  let stats = {
    stat1Label: 'Projects Completed',
    stat1Value: '500+',
    stat2Label: 'Tiles Delivered',
    stat2Value: '10k+',
    stat3Label: 'Global Partners',
    stat3Value: '20+'
  };

  try {
    const statsSnap = await getDoc(doc(db, "settings", "stats"));
    if (statsSnap.exists()) {
      stats = statsSnap.data() as any;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

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
      <section className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-12">
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

      {/* Interactive Stats Section */}
      <section className="py-12 bg-[#FAFAFA] mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-5xl font-serif font-bold text-gold-600 mb-2 block">{stats.stat1Value}</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">{stats.stat1Label}</span>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-5xl font-serif font-bold text-gold-600 mb-2 block">{stats.stat2Value}</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">{stats.stat2Label}</span>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-5xl font-serif font-bold text-gold-600 mb-2 block">{stats.stat3Value}</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">{stats.stat3Label}</span>
            </div>
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

      {/* Custom Pre-Order Banner (Updated) */}
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
                  Bypass the markup. Secure your building materials directly from our upcoming shipments or make a **special custom request** for items not listed.
                </p>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link 
                  href="/pre-order" 
                  className="w-full lg:w-auto inline-flex items-center justify-center px-10 py-5 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/40"
                >
                  Make Custom Request
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
                <svg className="w-10 h-10 text-[#111111] group-hover:text-gold-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v12"></path></svg>
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

      {/* Testimonials Slider (Static for now, but premium design) */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Testimonials</span>
            <h2 className="text-4xl font-serif font-bold text-[#111111] mb-6">What Our Clients Say</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"The quality of the ceramics we received for our hotel project was outstanding. P-Burns delivered on time and the installation was flawless."</p>
              <div>
                <p className="font-bold text-[#111111]">Kofi Annan</p>
                <p className="text-xs text-gray-500">Project Manager, Accra</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"I requested a custom pre-order for a specific type of Italian door, and P-Burns handled everything from sourcing to delivery. Excellent service!"</p>
              <div>
                <p className="font-bold text-[#111111]">Ama Serwaa</p>
                <p className="text-xs text-gray-500">Home Owner, Kumasi</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex text-gold-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"Their security doors are the best in the market. Heavy, secure, and beautiful. I recommend P-Burns to all my clients."</p>
              <div>
                <p className="font-bold text-[#111111]">Yaw Boateng</p>
                <p className="text-xs text-gray-500">Architect, Takoradi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/233537749190" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gold-600 text-white p-4 rounded-full shadow-2xl hover:bg-gold-500 transition-all active:scale-95 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.178 0 6.164 1.238 8.411 3.484 2.247 2.246 3.484 5.232 3.484 8.411 0 6.556-5.332 11.888-11.888 11.888-2.018 0-3.99-.513-5.744-1.488l-6.251 1.701zm6.59-4.819c1.54.919 3.109 1.401 4.736 1.401 5.402 0 9.799-4.397 9.799-9.799 0-2.618-1.02-5.08-2.871-6.931-1.851-1.851-4.312-2.871-6.931-2.871-5.402 0-9.799 4.397-9.799 9.799 0 1.769.49 3.42 1.417 4.773l-.997 3.64 3.743-.918z"/>
          <path d="M17.487 14.921c-.265-.133-1.567-.773-1.801-.857-.233-.085-.403-.133-.573.133-.171.265-.658.857-.806 1.023-.148.165-.297.185-.562.052-.265-.133-1.12-.413-2.133-1.317-.788-.702-1.32-1.569-1.475-1.834-.155-.265-.017-.409.116-.541.12-.119.265-.313.397-.47.133-.156.177-.265.265-.442.088-.177.044-.332-.022-.464-.066-.133-.573-1.381-.785-1.89-.207-.496-.419-.42-.573-.428-.148-.007-.318-.008-.488-.008-.17 0-.446.064-.679.318-.233.265-.892.872-.892 2.128 0 1.256.913 2.471 1.04 2.637.127.165 1.797 2.744 4.354 3.85.608.263 1.083.42 1.453.538.61.194 1.165.167 1.604.101.49-.074 1.567-.64 1.787-1.258.22-.617.22-1.149.155-1.257-.065-.11-.233-.177-.499-.31z"/>
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold uppercase tracking-widest ml-0 group-hover:ml-2">Chat with us</span>
      </a>

    </div>
  );
}
