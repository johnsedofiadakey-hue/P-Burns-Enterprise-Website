'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore'

// Mock data
const mockProducts = [
  { id: '1', name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, description: 'High quality ceramic tile for floors and walls. Durable and easy to clean.', stock: 50 },
  { id: '2', name: 'Wooden Door B', category: 'doors', price: 450.00, description: 'Solid wooden door with elegant design. Suitable for main entrance or rooms.', stock: 10 },
  { id: '3', name: 'Home Item C', category: 'home_items', price: 85.00, description: 'Useful home item for daily use. High quality material.', stock: 0 },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Try mock data as fallback
          const foundProduct = mockProducts.find(p => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            router.push('/shop');
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, router])

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(id));
  }, [id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist = [...wishlist];
    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter(itemId => itemId !== id);
      setIsInWishlist(false);
    } else {
      updatedWishlist.push(id);
      setIsInWishlist(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", id),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          ...reviewForm
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Review submitted successfully!');
        setReviewForm({ name: '', email: '', rating: 5, comment: '' });
        // Refresh reviews
        const q = query(collection(db, "reviews"), where("productId", "==", id), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        alert('Failed to submit review: ' + data.error);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", product.category),
          where("status", "==", "published"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const products: any[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== product.id) {
            products.push({ id: doc.id, ...doc.data() });
          }
        });
        setRelatedProducts(products.slice(0, 4)); // Limit to 4
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    fetchRelatedProducts();
  }, [product])

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>
  }

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart`)
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-charcoal-950 hover:text-gold-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative h-[400px] bg-white rounded-sm flex items-center justify-center overflow-hidden border border-gray-100">
              {product.image || (product.images && product.images.length > 0) ? (
                <Image 
                  src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain" 
                  unoptimized 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-20 h-20 text-gold-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-sm mt-2">No image available</span>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    className={`relative h-16 cursor-pointer border ${index === currentImageIndex ? 'border-gold-500' : 'border-gray-200'} rounded-sm overflow-hidden bg-white`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between py-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2 block">{product.category}</span>
              <h1 className="text-4xl font-black text-charcoal-950 uppercase tracking-tight mb-4">{product.name}</h1>
              <div className="w-16 h-1 bg-gold-500 mb-6"></div>
              
              <p className="text-3xl font-black text-charcoal-950 mb-6">GH₵ {product.price.toFixed(2)}</p>
              
              <div className="prose prose-sm text-gray-500 mb-8 max-w-none">
                <p>{product.description}</p>
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Status:</span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  product.stock > 0 ? 'bg-gold-500/10 text-gold-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-6 mb-8">
                <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</label>
                <div className="relative">
                  <input 
                    type="number" 
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 px-4 py-2 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 transition-colors text-sm font-bold text-charcoal-950" 
                    disabled={product.stock === 0}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 px-6 rounded-sm font-bold uppercase tracking-wider text-sm text-white transition-all ${
                    product.stock > 0 
                      ? 'bg-gold-600 hover:bg-gold-500 shadow-lg shadow-gold-900/20 active:scale-95' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  onClick={() => alert('Quote requested')}
                  className="w-full py-4 px-6 rounded-sm font-bold uppercase tracking-wider text-sm text-charcoal-950 border border-charcoal-950 hover:bg-charcoal-950 hover:text-white transition-all active:scale-95"
                >
                  Request a Quote
                </button>
                <button 
                  onClick={toggleWishlist}
                  className="w-full py-4 px-6 rounded-sm font-bold uppercase tracking-wider text-sm text-charcoal-950 border border-gray-200 hover:border-charcoal-950 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-24 border-t border-gray-100 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Reviews List */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-black text-charcoal-950 uppercase tracking-tight mb-8">Customer Reviews ({reviews.length})</h2>
                
                {loadingReviews ? (
                  <p className="text-gray-500">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-charcoal-950">{review.name}</div>
                            <div className="text-xs text-gray-500">
                              {review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </div>
                          </div>
                          <div className="flex text-gold-500">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Add Review Form */}
              <div>
                <h2 className="text-2xl font-black text-charcoal-950 uppercase tracking-tight mb-8">Leave a Review</h2>
                <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Name *</label>
                    <input 
                      type="text" 
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email</label>
                    <input 
                      type="email" 
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Rating *</label>
                    <select 
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Comment *</label>
                    <textarea 
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gold-500 text-sm"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className={`w-full py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs hover:bg-gold-600 transition-colors ${submittingReview ? 'opacity-50' : ''}`}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl font-black text-charcoal-950 uppercase tracking-tight mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <Link href={`/shop/${p.id}`} key={p.id} className="group">
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-all duration-500" unoptimized />
                        ) : (
                          <svg className="w-12 h-12 text-gold-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-charcoal-950 uppercase tracking-tight group-hover:text-gold-600 transition-colors truncate">{p.name}</h3>
                        <p className="text-sm font-black text-charcoal-950 mt-1">GH₵ {p.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
