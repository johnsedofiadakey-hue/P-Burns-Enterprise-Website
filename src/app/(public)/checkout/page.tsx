'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function CheckoutPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cartItems, setCartItems] = useState<{id:string, name:string, price:number, quantity:number}[]>([])
  const router = useRouter()

  const [paystackKey, setPaystackKey] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(50.00)
  const [whatsappNumber, setWhatsappNumber] = useState('+233123456789')

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "general"));
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setPaystackKey(data.paystackPublicKey || '');
          setDeliveryFee(data.deliveryFee ?? 50.00);
          setWhatsappNumber(data.whatsappNumber || '+233123456789');
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, [])

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const total = subtotal + deliveryFee

  const handlePaystackPayment = () => {
    if (!(window as any).PaystackPop) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }
    const handler = (window as any).PaystackPop.setup({
      key: paystackKey || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: email,
      amount: total * 100, // Paystack expects amount in pesewas
      currency: 'GHS',
      ref: (new Date()).getTime().toString(),
      callback: function(response: any) {
        (async () => {
          try {
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name,
                email,
                phone,
                address,
                items: cartItems,
                subtotal,
                deliveryFee,
                total,
                paymentReference: response.reference
              })
            });

            const data = await res.json();
            if (data.success) {
              localStorage.removeItem('cart')
              router.push('/checkout/success')
            } else {
              alert('Payment successful, but failed to process order. Please contact support.')
            }
          } catch (error) {
            console.error("Error saving order:", error);
            alert('Payment successful, but failed to process order. Please contact support.');
          }
        })();
      },
      onClose: function() {
        alert('Payment closed')
      }
    });
    handler.openIframe();
  }

  const handleWhatsAppOrder = async () => {
    if (!email || !name || !phone || !address) {
      alert('Please fill in all fields')
      return
    }
    
    try {
      const orderNumber = `PB-WA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          items: cartItems,
          subtotal,
          deliveryFee,
          total,
          orderNumber,
          status: 'Pending WhatsApp'
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create order');
      
      const itemsText = cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')
      const message = `Hello, I want to place an order.\n\n*Order No:* ${orderNumber}\n*Name:* ${name}\n*Items:* ${itemsText}\n*Total:* GH₵ ${total.toFixed(2)}\n\nPlease process my order.`
      
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cart-updated'))
      
      window.open(whatsappUrl, '_blank')
      router.push('/checkout/success')
    } catch (error) {
      console.error("Error creating WhatsApp order:", error);
      alert('Failed to create order. Please try again.');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !phone || !address) {
      alert('Please fill in all fields')
      return
    }
    handlePaystackPayment()
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <Script 
        src="https://js.paystack.co/v1/inline.js" 
        strategy="afterInteractive"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Secure Checkout</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Customer Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gold-600 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
                >
                  Pay with Paystack
                </button>
                <button 
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full mt-4 py-4 bg-[#25D366] text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                  Order via WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-charcoal-900/5 border border-gray-100 h-fit">
              <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                    <span className="font-bold text-[#111111]">GH₵ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111111]">GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#111111]">GH₵ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 my-4 pt-4 flex justify-between font-black text-[#111111] text-lg uppercase">
                  <span>Total</span>
                  <span className="text-gold-600">GH₵ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
