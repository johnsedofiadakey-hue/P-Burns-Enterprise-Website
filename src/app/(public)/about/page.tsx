import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export default async function AboutPage() {
  // Default content
  let content = {
    heroTitle: 'About P-Burns Enterprise',
    heroDesc: 'Ghana\'s premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.',
    storyTitle: 'Built on Quality & Trust',
    storyContent: 'Founded with a vision to revolutionize the construction and building finishing industry in Ghana, P-Burns Enterprise has grown to become a trusted name for individuals and large-scale developers alike.\n\nWe specialize in sourcing premium ceramics, luxury doors, and enterprise construction supplies directly from top global manufacturers. This allows us to bypass middlemen and offer our clients the best quality at highly competitive rates.\n\nWhether you are working on a single-room renovation or a multi-story commercial project, we have the capacity and the expertise to supply and install materials that meet international standards.'
  };

  try {
    const aboutSnap = await getDocFromServer(doc(db, "settings", "about"));
    if (aboutSnap.exists()) {
      content = aboutSnap.data() as any;
    }
  } catch (error) {
    console.error("Error fetching about content:", error);
  }

  // Split story content by newlines to create paragraphs
  const paragraphs = content.storyContent.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#111111] text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/50 to-[#111111] z-10" />
          <Image
            src="/hero_showroom.png"
            alt="About P-Burns"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{content.heroTitle}</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {content.heroDesc}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Heritage</span>
              <h2 className="text-3xl font-serif font-bold text-[#111111] mb-6">{content.storyTitle}</h2>
              <div className="w-16 h-1 bg-gold-500 mb-6"></div>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/category_ceramics.png"
                alt="Our Quality"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Core Values</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">What Drives Us</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-8 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors">
              <div className="text-gold-500 mb-4 text-3xl">🏆</div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We never compromise on quality. Every item in our catalog is rigorously checked to ensure durability and aesthetic appeal.</p>
            </div>
            <div className="bg-[#1A1A1A] p-8 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors">
              <div className="text-gold-500 mb-4 text-3xl">🤝</div>
              <h3 className="text-xl font-bold mb-2">Customer Trust</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We build long-term relationships with our clients based on transparency, reliability, and excellent service.</p>
            </div>
            <div className="bg-[#1A1A1A] p-8 rounded-xl border border-white/5 hover:border-gold-500/20 transition-colors">
              <div className="text-gold-500 mb-4 text-3xl">🌍</div>
              <h3 className="text-xl font-bold mb-2">Global Sourcing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">We scour the globe to bring you the latest trends and the strongest materials in building finishing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#111111] mb-6">Ready to Elevate Your Project?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Contact us today to discuss your requirements or request a custom quote for your project.</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="px-8 py-4 bg-gold-600 text-white font-bold rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20">
              Contact Us
            </Link>
            <Link href="/shop" className="px-8 py-4 bg-transparent border border-gray-300 text-[#111111] font-bold rounded-full hover:bg-gray-50 transition-colors">
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
