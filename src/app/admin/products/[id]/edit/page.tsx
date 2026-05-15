'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

export default function EditProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('draft')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) {
          showToast('Product not found', 'error');
          router.push('/admin/products');
          return;
        }
        const data = await res.json();
        
        setName(data.name || '')
        setDescription(data.description || '')
        setPrice(String(data.price || ''))
        setStock(String(data.stock || ''))
        setCategory(data.category || '')
        setStatus(data.status || 'draft')
        if (data.images && Array.isArray(data.images)) {
          setImagePreviews(data.images);
        } else if (data.image) {
          setImagePreviews([data.image]);
        }

        // Fetch categories
        const catRes = await fetch('/api/admin/categories');
        const cats = catRes.ok ? await catRes.json() : [];
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast('Error loading product', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      setUploading(true)
      
      let imageUrls = imagePreviews.filter(p => !p.startsWith('blob:'));
      
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'products');
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Image upload failed');
          }
          
          const data = await response.json();
          imageUrls.push(data.url);
        }
      }
      
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
          status,
          image: imageUrls[0] || '/placeholder.png',
          images: imageUrls
        })
      });

      if (!res.ok) throw new Error('Failed to update product');

      showToast('Product updated successfully!')
      setTimeout(() => router.push('/admin/products'), 1000)
    } catch (error: any) {
      console.error("Error updating product:", error)
      showToast('Error updating product: ' + error.message, 'error')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  // Default category options in case Firestore has none yet
  const defaultCategories = [
    { id: 'ceramics', name: 'Ceramics' },
    { id: 'doors', name: 'Doors' },
    { id: 'home_items', name: 'Home Items' },
  ]
  const categoryOptions = categories.length > 0 ? categories : defaultCategories

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 font-medium">Loading product...</div>
      </div>
    )
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2`}>
          {toast.type === 'success' ? '✨' : '🛑'} {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Edit Product</h2>
          <p className="text-sm text-gray-500">Update product details and inventory</p>
        </div>
        <button
          onClick={() => router.push('/admin/products')}
          className="text-sm text-gray-500 hover:text-[#111111] transition-colors"
        >
          ← Back to Products
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Product Images</label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image src={preview} alt="Product" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles(files);
                setImagePreviews([...imagePreviews, ...files.map(f => URL.createObjectURL(f))]);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm" 
            />
            {imageFiles.length > 0 && <p className="text-xs text-gray-500 mt-1">{imageFiles.length} new files selected</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Price (GH₵)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${(saving || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
