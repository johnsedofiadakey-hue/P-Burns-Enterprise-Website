'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [phone, setPhone] = useState('+233 123 456 789')
  const [email, setEmail] = useState('info@pburns.com')
  const [address, setAddress] = useState('123 Street, Accra, Ghana')
  const [facebook, setFacebook] = useState('https://facebook.com/pburns')
  const [instagram, setInstagram] = useState('https://instagram.com/pburns')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Settings updated (mock)')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Office Address</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <hr className="my-6 border-gray-100" />
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
            <input 
              type="url" 
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
            <input 
              type="url" 
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
