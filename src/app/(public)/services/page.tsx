'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function ServicesPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('windows')
  const [message, setMessage] = useState('')
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        if (!querySnapshot.empty) {
          const fetchedServices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setServices(fetchedServices);
        } else {
          setServices([
            { name: 'Windows Supply & Installation', description: 'We source and install high-quality windows for residential and commercial buildings. Our team ensures precise measurement and perfect fit.' },
            { name: 'General Supply Contracts', description: 'We handle bulk supply contracts for construction projects. Ceramics, doors, and other hardware items in large quantities.' }
          ])
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Service request submitted (mock)')
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Enterprise</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-4">Our Services</h1>
        <p className="text-gray-600 mb-12 max-w-3xl text-lg">
          We offer professional services for your construction and home improvement projects. 
          From material supply to full installation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {services.map((serv, index) => (
            <div key={serv.id || index} className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#111111] mb-3">{serv.name}</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {serv.description}
                </p>
                {serv.rate && serv.rate !== 'Varies' && (
                  <p className="text-sm font-bold text-gold-600 mt-auto">Rate: {serv.rate}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Request Form */}
        <div className="bg-[#111111] text-white p-10 md:p-16 rounded-3xl max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle logo monogram watermark in background */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <span className="text-[200px] font-black text-white leading-none">PB</span>
          </div>
          
          <div className="relative z-10">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Get a Quote</span>
            <h2 className="text-3xl font-serif font-bold mb-2">Request a Service</h2>
            <p className="text-gray-400 mb-10 text-sm">Fill the form below and we will get back to you with a tailored proposal.</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-charcoal-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-white placeholder-gray-600" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-charcoal-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-white placeholder-gray-600" 
                  placeholder="Your email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">Service Type</label>
                <select 
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-charcoal-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-white"
                >
                  <option value="windows">Windows Installation</option>
                  <option value="supply">Bulk Supply Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">Message / Details</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-charcoal-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-white placeholder-gray-600" 
                  placeholder="Tell us about your project..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button 
                  type="submit"
                  className="px-10 py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
