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
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

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
        showToast("Error fetching settings", "error");
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
      
      showToast('Settings updated successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading settings...</div>

  return (
    <div className="relative">
      {/* Animated Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out translate-y-0 opacity-100 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2`}>
          {toast.type === 'success' ? '✨' : '🛑'}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Site & Invoice Settings</h2>
        <p className="text-sm text-gray-500">Manage your business information and theme</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-4xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Configuration</span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Address</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                rows={2} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Bank Details */}
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-4">Bank Details (For Invoices)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Bank Name</label>
                <input 
                  type="text" 
                  value={bankName} 
                  onChange={(e) => setBankName(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Account Name</label>
                <input 
                  type="text" 
                  value={accountName} 
                  onChange={(e) => setAccountName(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Account Number</label>
                <input 
                  type="text" 
                  value={accountNumber} 
                  onChange={(e) => setAccountNumber(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Terms */}
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-4">Invoice Terms & Conditions</h3>
            <textarea 
              value={terms} 
              onChange={(e) => setTerms(e.target.value)} 
              rows={3} 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
            />
          </div>

          <hr className="border-gray-100" />

          {/* Theme */}
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-4">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Primary Color (Gold)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    className="w-16 h-12 border border-gray-200 rounded-lg cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Secondary Color (Charcoal)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                    className="w-16 h-12 border border-gray-200 rounded-lg cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={saving}
              className={`px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
