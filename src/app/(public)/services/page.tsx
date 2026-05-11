'use client'

import { useState } from 'react'

export default function ServicesPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('windows')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Service request submitted (mock)')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        We offer professional services for your construction and home improvement projects. 
        From material supply to full installation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Windows Installation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Windows Supply & Installation</h2>
          <p className="text-gray-600 text-sm mb-4">
            We source and install high-quality windows for residential and commercial buildings. 
            Our team ensures precise measurement and perfect fit.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Aluminum sliding windows</li>
            <li>• Casement windows</li>
            <li>• Custom sizes available</li>
          </ul>
        </div>

        {/* General Contracts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">General Supply Contracts</h2>
          <p className="text-gray-600 text-sm mb-4">
            We handle bulk supply contracts for construction projects. 
            Ceramics, doors, and other hardware items in large quantities.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Site delivery</li>
            <li>• Bulk discounts</li>
            <li>• Project consultation</li>
          </ul>
        </div>
      </div>

      {/* Request Form */}
      <div className="bg-emerald-900 text-white p-8 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Request a Service</h2>
        <p className="text-emerald-200 mb-6 text-sm">Fill the form below and we will get back to you with a quote.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-emerald-200">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 bg-emerald-800 border border-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-emerald-400" 
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-200">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 bg-emerald-800 border border-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-emerald-400" 
              placeholder="Your email"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-emerald-200">Service Type</label>
            <select 
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-emerald-800 border border-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white"
            >
              <option value="windows">Windows Installation</option>
              <option value="supply">Bulk Supply Contract</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-emerald-200">Message / Details</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full px-3 py-2 bg-emerald-800 border border-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-emerald-400" 
              placeholder="Tell us about your project..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 bg-white text-emerald-900 font-medium rounded-md hover:bg-emerald-50 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
