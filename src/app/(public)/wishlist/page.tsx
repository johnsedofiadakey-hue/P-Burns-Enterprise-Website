'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(
          wishlist.map(async (id: string) => {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
          })
        );
        setWishlistItems(items.filter(item => item !== null));
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = (id: string) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter((itemId: string) => itemId !== id);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item: any) => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Your Favorites</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-12">Wishlist</h1>

        {loading ? (
          <p className="text-gray-500">Loading wishlist...</p>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
            <Link href="/shop" className="inline-block bg-[#111111] text-white font-bold uppercase tracking-wider text-sm px-6 py-3 hover:bg-gold-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  )}
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <Link href={`/shop/${product.id}`} className="block flex-1">
                    <h3 className="text-lg font-bold text-charcoal-950 truncate mb-1">{product.name}</h3>
                    <p className="text-gold-600 font-bold mb-4">GH₵ {product.price.toFixed(2)}</p>
                  </Link>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs hover:bg-gold-600 transition-colors mt-auto"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
