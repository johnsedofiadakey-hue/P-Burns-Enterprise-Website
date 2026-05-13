'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function SettingsPage() {
  const [phone, setPhone] = useState('+233 123 456 789')
  const [email, setEmail] = useState('info@pburns.com')
  const [address, setAddress] = useState('123 Street, Accra, Ghana')
  
  // Bank Details
  const [bankName, setBankName] = useState('GT Bank')
  const [accountName, setAccountName] = useState('P-Burns Enterprise')
  const [accountNumber, setAccountNumber] = useState('1234567890')
  
  // Terms
  const [terms, setTerms] = useState('Payment is due within 30 days.')
  
  // Theme
  const [primaryColor, setPrimaryColor] = useState('#B68D40')
  const [secondaryColor, setSecondaryColor] = useState('#111111')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setBankName(data.bankName || '');
          setAccountName(data.accountName || '');
          setAccountNumber(data.accountNumber || '');
          setTerms(data.terms || '');
        }
        
        const themeSnap = await getDoc(doc(db, "settings", "theme"));
        if (themeSnap.exists()) {
          const data = themeSnap.data();
          setPrimaryColor(data.primary || '#B68D40');
          setSecondaryColor(data.secondary || '#111111');
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Save general settings
      await setDoc(doc(db, "settings", "general"), {
        phone, email, address, bankName, accountName, accountNumber, terms,
        updatedAt: new Date().toISOString()
      });
      
      // Save theme settings
      await setDoc(doc(db, "settings", "theme"), {
        primary: primaryColor,
        secondary: secondaryColor,
        background: '#FAFAFA', // Default
        updatedAt: new Date().toISOString()
      });
      
      alert('Settings updated successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Error saving settings');
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading settings...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Site & Invoice Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
            </div>
          </div>

          <hr />

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Bank Details (For Invoices)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
              </div>
            </div>
          </div>

          <hr />

          {/* Terms */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Invoice Terms & Conditions</h3>
            <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500" />
          </div>

          <hr />

          {/* Theme */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Theme Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color (Gold)</label>
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="mt-1 w-full h-10 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Color (Charcoal)</label>
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="mt-1 w-full h-10 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={saving}
              className={`px-4 py-2 bg-gold-600 text-white rounded-md hover:bg-gold-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
