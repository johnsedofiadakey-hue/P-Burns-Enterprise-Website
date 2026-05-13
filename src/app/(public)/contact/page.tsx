'use client'

import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState({
    phone: '+233 123 456 789',
    email: 'info@pburns.com',
    address: '123 Street, Accra, Ghana'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, "settings", "general"));
        if (snap.exists()) {
          const data = snap.data();
          setSettings({
            phone: data.phone || '+233 123 456 789',
            email: data.email || 'info@pburns.com',
            address: data.address || '123 Street, Accra, Ghana'
          });
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Message sent (mock)')
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Connect</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-12 max-w-3xl text-lg">
          Have questions about our products or services? Get in touch with us.
        </p>

        {/* Showroom Map */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg shadow-charcoal-900/10 mb-16 border border-gray-100">
          <iframe 
            src="https://maps.google.com/maps?q=6.211472,-2.477528&hl=en&z=15&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Get in Touch</h2>
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-bold text-[#111111] uppercase text-sm tracking-wide mb-1">Address</h3>
                  <p className="text-sm whitespace-pre-line">{settings.address}</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] uppercase text-sm tracking-wide mb-1">Phone</h3>
                  <p className="text-sm">{settings.phone}</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] uppercase text-sm tracking-wide mb-1">Email</h3>
                  <p className="text-sm">{settings.email}</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] uppercase text-sm tracking-wide mb-1">Business Hours</h3>
                  <p className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-sm">Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
