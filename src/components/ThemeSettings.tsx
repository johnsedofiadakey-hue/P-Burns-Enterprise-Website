'use client'

import { useState, useEffect } from 'react'

export default function ThemeSettings() {
  const [primary, setPrimary] = useState('#B68D40')
  const [secondary, setSecondary] = useState('#111111')
  const [background, setBackground] = useState('#FAFAFA')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPrimary(data.primary)
          setSecondary(data.secondary)
          setBackground(data.background)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primary, secondary, background })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Theme updated successfully! Refresh the public site to see changes.')
      } else {
        setMessage('Failed to update theme.')
      }
    } catch (error) {
      setMessage('An error occurred.')
    }
    setSaving(false)
  }

  if (loading) return <div>Loading theme settings...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Theme Customization</h3>
      <p className="text-gray-600 text-sm mb-6">Change the colors of the public website.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Primary Color (Gold)</label>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input 
              type="text" 
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Secondary Color (Charcoal)</label>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input 
              type="text" 
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Background Color</label>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input 
              type="text" 
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Theme'}
        </button>

        {message && (
          <p className={`text-sm mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
