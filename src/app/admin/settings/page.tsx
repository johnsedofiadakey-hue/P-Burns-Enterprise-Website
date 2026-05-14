'use client'

import { useState, useEffect } from 'react'
import { db, storage } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Image from 'next/image'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  
  // Company Info
  const [phone, setPhone] = useState('+233 123 456 789')
  const [email, setEmail] = useState('info@pburns.com')
  const [address, setAddress] = useState('Sefwi Dwinase, Western North Region')
  
  // Bank Details
  const [bankName, setBankName] = useState('GT Bank')
  const [accountName, setAccountName] = useState('P-Burns Enterprise')
  const [accountNumber, setAccountNumber] = useState('1234567890')
  
  // Terms
  const [terms, setTerms] = useState('Payment is due within 30 days.')
  
  // Social Media
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  
  // Theme
  const [primaryColor, setPrimaryColor] = useState('#B68D40')
  const [secondaryColor, setSecondaryColor] = useState('#111111')
  const [backgroundColor, setBackgroundColor] = useState('#FAFAFA')
  
  // Branding
  const [logoUrl, setLogoUrl] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  
  // Interactive Stats
  const [stat1Label, setStat1Label] = useState('Projects Completed')
  const [stat1Value, setStat1Value] = useState('500+')
  const [stat2Label, setStat2Label] = useState('Tiles Delivered')
  const [stat2Value, setStat2Value] = useState('10k+')
  const [stat3Label, setStat3Label] = useState('Global Partners')
  const [stat3Value, setStat3Value] = useState('20+')
  
  // About Page
  const [aboutHeroTitle, setAboutHeroTitle] = useState('About P-Burns Enterprise')
  const [aboutHeroDesc, setAboutHeroDesc] = useState('Ghana\'s premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.')
  const [aboutStoryTitle, setAboutStoryTitle] = useState('Built on Quality & Trust')
  const [aboutStoryContent, setAboutStoryContent] = useState('Founded with a vision to revolutionize the construction and building finishing industry in Ghana, P-Burns Enterprise has grown to become a trusted name for individuals and large-scale developers alike.\n\nWe specialize in sourcing premium ceramics, luxury doors, and enterprise construction supplies directly from top global manufacturers. This allows us to bypass middlemen and offer our clients the best quality at highly competitive rates.')
  
  // Testimonials
  const [t1Name, setT1Name] = useState('Kofi Annan')
  const [t1Role, setT1Role] = useState('Project Manager, Accra')
  const [t1Quote, setT1Quote] = useState('"The quality of the ceramics we received for our hotel project was outstanding. P-Burns delivered on time and the installation was flawless."')
  
  const [t2Name, setT2Name] = useState('Ama Serwaa')
  const [t2Role, setT2Role] = useState('Home Owner, Kumasi')
  const [t2Quote, setT2Quote] = useState('"I requested a custom pre-order for a specific type of Italian door, and P-Burns handled everything from sourcing to delivery. Excellent service!"')
  
  const [t3Name, setT3Name] = useState('Yaw Boateng')
  const [t3Role, setT3Role] = useState('Architect, Takoradi')
  const [t3Quote, setT3Quote] = useState('"Their security doors are the best in the market. Heavy, secure, and beautiful. I recommend P-Burns to all my clients."')
  
  // Projects
  const [p1Title, setP1Title] = useState('Luxury Hotel Accra')
  const [p1Desc, setP1Desc] = useState('Complete floor and wall tiling for a 50-room luxury hotel.')
  const [p1Image, setP1Image] = useState('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3')
  const [p1File, setP1File] = useState<File | null>(null)
  const [p2File, setP2File] = useState<File | null>(null)
  const [p3File, setP3File] = useState<File | null>(null)
  
  const [p2Title, setP2Title] = useState('Private Mansion Kumasi')
  const [p2Desc, setP2Desc] = useState('Custom imported security doors and window fixtures.')
  const [p2Image, setP2Image] = useState('/category_doors.png')
  
  const [p3Title, setP3Title] = useState('Corporate Office Ridge')
  const [p3Desc, setP3Desc] = useState('Modern glass partitions and accessories.')
  const [p3Image, setP3Image] = useState('/category_home_items.png')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [docSnap, themeSnap, statsSnap, aboutSnap, testimonialsSnap, projectsSnap] = await Promise.all([
          getDoc(doc(db, "settings", "general")),
          getDoc(doc(db, "settings", "theme")),
          getDoc(doc(db, "settings", "stats")),
          getDoc(doc(db, "settings", "about")),
          getDoc(doc(db, "settings", "testimonials")),
          getDoc(doc(db, "settings", "projects"))
        ]);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setBankName(data.bankName || '');
          setAccountName(data.accountName || '');
          setAccountNumber(data.accountNumber || '');
          setTerms(data.terms || '');
          setTiktokUrl(data.tiktokUrl || '');
          setInstagramUrl(data.instagramUrl || '');
          setFacebookUrl(data.facebookUrl || '');
          setWhatsappUrl(data.whatsappUrl || '');
        }
        
        if (themeSnap.exists()) {
          const data = themeSnap.data();
          setPrimaryColor(data.primary || '#B68D40');
          setSecondaryColor(data.secondary || '#111111');
          setBackgroundColor(data.background || '#FAFAFA');
          setLogoUrl(data.logoUrl || '');
        }
        
        if (statsSnap.exists()) {
          const data = statsSnap.data();
          setStat1Label(data.stat1Label || 'Projects Completed');
          setStat1Value(data.stat1Value || '500+');
          setStat2Label(data.stat2Label || 'Tiles Delivered');
          setStat2Value(data.stat2Value || '10k+');
          setStat3Label(data.stat3Label || 'Global Partners');
          setStat3Value(data.stat3Value || '20+');
        }
        
        if (aboutSnap.exists()) {
          const data = aboutSnap.data();
          setAboutHeroTitle(data.heroTitle || 'About P-Burns Enterprise');
          setAboutHeroDesc(data.heroDesc || 'Ghana\'s premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.');
          setAboutStoryTitle(data.storyTitle || 'Built on Quality & Trust');
          setAboutStoryContent(data.storyContent || 'Founded with a vision to revolutionize the construction and building finishing industry in Ghana, P-Burns Enterprise has grown to become a trusted name for individuals and large-scale developers alike.\n\nWe specialize in sourcing premium ceramics, luxury doors, and enterprise construction supplies directly from top global manufacturers. This allows us to bypass middlemen and offer our clients the best quality at highly competitive rates.');
        }
        
        if (testimonialsSnap.exists()) {
          const data = testimonialsSnap.data();
          setT1Name(data.t1Name || 'Kofi Annan');
          setT1Role(data.t1Role || 'Project Manager, Accra');
          setT1Quote(data.t1Quote || '"The quality of the ceramics we received for our hotel project was outstanding. P-Burns delivered on time and the installation was flawless."');
          setT2Name(data.t2Name || 'Ama Serwaa');
          setT2Role(data.t2Role || 'Home Owner, Kumasi');
          setT2Quote(data.t2Quote || '"I requested a custom pre-order for a specific type of Italian door, and P-Burns handled everything from sourcing to delivery. Excellent service!"');
          setT3Name(data.t3Name || 'Yaw Boateng');
          setT3Role(data.t3Role || 'Architect, Takoradi');
          setT3Quote(data.t3Quote || '"Their security doors are the best in the market. Heavy, secure, and beautiful. I recommend P-Burns to all my clients."');
        }

        if (projectsSnap.exists()) {
          const data = projectsSnap.data();
          setP1Title(data.p1Title || 'Luxury Hotel Accra');
          setP1Desc(data.p1Desc || 'Premium ceramic tiling for the entire lobby and suites.');
          setP1Image(data.p1Image || '/category_ceramics.png');
          setP2Title(data.p2Title || 'Private Mansion Kumasi');
          setP2Desc(data.p2Desc || 'Custom imported security doors and window fixtures.');
          setP2Image(data.p2Image || '/category_doors.png');
          setP3Title(data.p3Title || 'Corporate Office Ridge');
          setP3Desc(data.p3Desc || 'Modern glass partitions and accessories.');
          setP3Image(data.p3Image || '/category_home_items.png');
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

  const handleLogoUpload = async () => {
    if (!logoFile) return logoUrl;
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `branding/logo_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, logoFile);
      const url = await getDownloadURL(snapshot.ref);
      setLogoUrl(url);
      return url;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      showToast("Error uploading logo: " + error.message, "error");
      return logoUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Upload logo if changed
      const currentLogoUrl = await handleLogoUpload();
      
      // Save general settings
      await setDoc(doc(db, "settings", "general"), {
        phone, email, address, bankName, accountName, accountNumber, terms,
        tiktokUrl, instagramUrl, facebookUrl, whatsappUrl,
        updatedAt: new Date().toISOString()
      });
      
      // Save theme settings
      await setDoc(doc(db, "settings", "theme"), {
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        logoUrl: currentLogoUrl,
        updatedAt: new Date().toISOString()
      });
      
      // Save stats settings
      await setDoc(doc(db, "settings", "stats"), {
        stat1Label, stat1Value,
        stat2Label, stat2Value,
        stat3Label, stat3Value,
        updatedAt: new Date().toISOString()
      });
      
      // Save testimonials settings
      await setDoc(doc(db, "settings", "testimonials"), {
        t1Name, t1Role, t1Quote,
        t2Name, t2Role, t2Quote,
        t3Name, t3Role, t3Quote,
        updatedAt: new Date().toISOString()
      });

      let p1Url = p1Image;
      let p2Url = p2Image;
      let p3Url = p3Image;

      if (p1File) {
        const storageRef = ref(storage, `projects/p1_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, p1File);
        p1Url = await getDownloadURL(snapshot.ref);
      }
      if (p2File) {
        const storageRef = ref(storage, `projects/p2_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, p2File);
        p2Url = await getDownloadURL(snapshot.ref);
      }
      if (p3File) {
        const storageRef = ref(storage, `projects/p3_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, p3File);
        p3Url = await getDownloadURL(snapshot.ref);
      }

      // Save projects settings
      await setDoc(doc(db, "settings", "projects"), {
        p1Title, p1Desc, p1Image: p1Url,
        p2Title, p2Desc, p2Image: p2Url,
        p3Title, p3Desc, p3Image: p3Url,
        updatedAt: new Date().toISOString()
      });
      
      // Save testimonials settings
      await setDoc(doc(db, "settings", "testimonials"), {
        t1Name, t1Role, t1Quote,
        t2Name, t2Role, t2Quote,
        t3Name, t3Role, t3Quote,
        updatedAt: new Date().toISOString()
      });
      
      showToast('Settings & branding updated successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-700">Loading settings...</div>

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
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Settings & Customization</h2>
        <p className="text-sm text-gray-700">Manage your business information, invoices, and branding in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-100 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('company')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'company' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Company Info
        </button>
        <button 
          onClick={() => setActiveTab('invoicing')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'invoicing' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Invoicing & Payments
        </button>
        <button 
          onClick={() => setActiveTab('branding')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'branding' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Website Branding
        </button>
        <button 
          onClick={() => setActiveTab('stats')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'stats' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Interactive Stats
        </button>
        <button 
          onClick={() => setActiveTab('about')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'about' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          About Page
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'testimonials' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Testimonials
        </button>
        <button 
          onClick={() => setActiveTab('projects')} 
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'border-b-2 border-gold-500 text-[#111111]' : 'text-gray-400 hover:text-[#111111]'}`}
        >
          Projects
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        {/* Tab 1: Company Info */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">General & Contact Info</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Address</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                />
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-bold text-[#111111] uppercase tracking-tight mb-4">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">TikTok</label>
                    <input 
                      type="text" 
                      value={tiktokUrl} 
                      onChange={(e) => setTiktokUrl(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Instagram</label>
                    <input 
                      type="text" 
                      value={instagramUrl} 
                      onChange={(e) => setInstagramUrl(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Facebook</label>
                    <input 
                      type="text" 
                      value={facebookUrl} 
                      onChange={(e) => setFacebookUrl(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">WhatsApp</label>
                    <input 
                      type="text" 
                      value={whatsappUrl} 
                      onChange={(e) => setWhatsappUrl(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      placeholder="https://wa.me/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Invoicing Settings */}
        {activeTab === 'invoicing' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Invoicing & Payments</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName} 
                    onChange={(e) => setBankName(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Account Name</label>
                  <input 
                    type="text" 
                    value={accountName} 
                    onChange={(e) => setAccountName(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Account Number</label>
                  <input 
                    type="text" 
                    value={accountNumber} 
                    onChange={(e) => setAccountNumber(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Invoice Terms & Conditions</label>
                <textarea 
                  value={terms} 
                  onChange={(e) => setTerms(e.target.value)} 
                  rows={4} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Branding & Customization */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Branding & Customization</span>
            </div>
            <div className="p-6 space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Company Logo</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-32 h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                    {logoUrl ? (
                      <Image src={logoUrl} alt="Logo Preview" fill className="object-contain p-2" />
                    ) : (
                      <span className="text-xs text-gray-400">No Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="logo-upload"
                    />
                    <label 
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-600 transition-colors cursor-pointer inline-block mb-2"
                    >
                      {uploading ? 'Uploading...' : 'Choose Logo'}
                    </label>
                    <p className="text-xs text-gray-700">Recommended: Square PNG with transparent background.</p>
                    {logoFile && <p className="text-xs text-gold-600 mt-1 font-bold">Selected: {logoFile.name}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-[#111111] uppercase tracking-tight mb-4">Website Colors</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Primary Color (Gold)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Secondary Color (Charcoal)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)} 
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={backgroundColor} 
                        onChange={(e) => setBackgroundColor(e.target.value)} 
                        className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={backgroundColor} 
                        onChange={(e) => setBackgroundColor(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Stats */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Interactive Stats</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stat 1 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Stat 1</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Label</label>
                      <input 
                        type="text" 
                        value={stat1Label} 
                        onChange={(e) => setStat1Label(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Value</label>
                      <input 
                        type="text" 
                        value={stat1Value} 
                        onChange={(e) => setStat1Value(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stat 2 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Stat 2</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Label</label>
                      <input 
                        type="text" 
                        value={stat2Label} 
                        onChange={(e) => setStat2Label(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Value</label>
                      <input 
                        type="text" 
                        value={stat2Value} 
                        onChange={(e) => setStat2Value(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stat 3 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Stat 3</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Label</label>
                      <input 
                        type="text" 
                        value={stat3Label} 
                        onChange={(e) => setStat3Label(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Value</label>
                      <input 
                        type="text" 
                        value={stat3Value} 
                        onChange={(e) => setStat3Value(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: About Page */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">About Page Content</span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Hero Title</label>
                <input 
                  type="text" 
                  value={aboutHeroTitle} 
                  onChange={(e) => setAboutHeroTitle(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Hero Description</label>
                <textarea 
                  value={aboutHeroDesc} 
                  onChange={(e) => setAboutHeroDesc(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Story Title</label>
                <input 
                  type="text" 
                  value={aboutStoryTitle} 
                  onChange={(e) => setAboutStoryTitle(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Story Content</label>
                <textarea 
                  value={aboutStoryContent} 
                  onChange={(e) => setAboutStoryContent(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-48" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Client Testimonials</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Testimonial 1 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Testimonial 1</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Name</label>
                      <input 
                        type="text" 
                        value={t1Name} 
                        onChange={(e) => setT1Name(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Role</label>
                      <input 
                        type="text" 
                        value={t1Role} 
                        onChange={(e) => setT1Role(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Quote</label>
                      <textarea 
                        value={t1Quote} 
                        onChange={(e) => setT1Quote(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 2 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Testimonial 2</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Name</label>
                      <input 
                        type="text" 
                        value={t2Name} 
                        onChange={(e) => setT2Name(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Role</label>
                      <input 
                        type="text" 
                        value={t2Role} 
                        onChange={(e) => setT2Role(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Quote</label>
                      <textarea 
                        value={t2Quote} 
                        onChange={(e) => setT2Quote(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 3 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Testimonial 3</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Name</label>
                      <input 
                        type="text" 
                        value={t3Name} 
                        onChange={(e) => setT3Name(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Role</label>
                      <input 
                        type="text" 
                        value={t3Role} 
                        onChange={(e) => setT3Role(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Quote</label>
                      <textarea 
                        value={t3Quote} 
                        onChange={(e) => setT3Quote(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Projects */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">Featured Projects</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Project 1 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Project 1</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Title</label>
                      <input 
                        type="text" 
                        value={p1Title} 
                        onChange={(e) => setP1Title(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        value={p1Desc} 
                        onChange={(e) => setP1Desc(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setP1File(e.target.files?.[0] || null)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                      {p1Image && (
                        <div className="mt-2 text-xs text-gray-500 truncate">Current: {p1Image}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Project 2 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Project 2</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Title</label>
                      <input 
                        type="text" 
                        value={p2Title} 
                        onChange={(e) => setP2Title(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        value={p2Desc} 
                        onChange={(e) => setP2Desc(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setP2File(e.target.files?.[0] || null)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                      {p2Image && (
                        <div className="mt-2 text-xs text-gray-500 truncate">Current: {p2Image}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project 3 */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#111111] uppercase mb-4">Project 3</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Title</label>
                      <input 
                        type="text" 
                        value={p3Title} 
                        onChange={(e) => setP3Title(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        value={p3Desc} 
                        onChange={(e) => setP3Desc(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm h-24" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setP3File(e.target.files?.[0] || null)} 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
                      />
                      {p3Image && (
                        <div className="mt-2 text-xs text-gray-500 truncate">Current: {p3Image}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button 
            type="submit"
            disabled={saving || uploading}
            className={`px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${(saving || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
