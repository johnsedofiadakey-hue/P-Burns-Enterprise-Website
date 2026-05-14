'use client'

import { useState, useEffect } from 'react'
import { db, storage } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('draft')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Error fetching products", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Also fetch categories for the add product form
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
    };
    fetchCategories();
  }, []);

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed initial products? This will add duplicate items if already seeded.')) return;
    setLoading(true);
    try {
      const initialProducts = [
        { name: 'Ceramic Tile A', category: 'ceramics', price: 120.00, image: '/placeholder.png', description: 'High-quality ceramic tile.', stock: 100, status: 'In Stock', createdAt: new Date().toISOString() },
        { name: 'Wooden Door B', category: 'doors', price: 450.00, image: '/placeholder.png', description: 'Robust wooden door.', stock: 50, status: 'In Stock', createdAt: new Date().toISOString() },
        { name: 'Home Item C', category: 'home_items', price: 85.00, image: '/placeholder.png', description: 'Essential home item.', stock: 200, status: 'In Stock', createdAt: new Date().toISOString() },
        { name: 'Ceramic Tile B', category: 'ceramics', price: 150.00, image: '/placeholder.png', description: 'Premium ceramic tile.', stock: 80, status: 'In Stock', createdAt: new Date().toISOString() },
        { name: 'Steel Door', category: 'doors', price: 600.00, image: '/placeholder.png', description: 'Heavy security steel door.', stock: 30, status: 'In Stock', createdAt: new Date().toISOString() },
      ]
      
      for (const prod of initialProducts) {
        await addDoc(collection(db, "products"), prod);
      }
      
      showToast("Seeded initial products successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error seeding products:", error);
      showToast("Error seeding products", "error")
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Error deleting product", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      let imageUrl = '/placeholder.png';
      
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'products');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Image upload failed');
        }
        
        const data = await response.json();
        imageUrl = data.url;
        setUploading(false);
      }
      
      const docRef = await addDoc(collection(db, "products"), {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        status,
        image: imageUrl,
        createdAt: new Date().toISOString()
      });
      
      showToast('Product created successfully!');
      setIsModalOpen(false);
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategory('');
      setStatus('draft');
      setImageFile(null);
      setImagePreview('');
      
      // Refresh list
      fetchProducts();
    } catch (error: any) {
      console.error("Error adding product:", error);
      showToast('Error creating product: ' + error.message, "error");
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Products</h2>
          <p className="text-sm text-gray-700">Manage your inventory and stock</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            className="px-4 py-3 bg-gold-600 text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
          >
            Seed Initial Data
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-600 font-medium">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-600 font-medium">No products found.</td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">GH₵ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                    product.status === 'active' ? 'bg-green-50 text-green-700' : 
                    product.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {product.status === 'active' ? 'Active' : product.status === 'draft' ? 'Draft' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold flex gap-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-gold-600 hover:text-gold-700 transition-colors">Edit</Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-in Modal Overhaul */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content - Slide in from right */}
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add New Product</h3>
                <p className="text-xs text-gray-700 mt-1">Fill in the details to add to inventory</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-[#111111] transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Italian Ceramic Vase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="Describe the product details..."
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
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Stock</label>
                  <input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {(categories.length > 0 ? categories : [
                    { id: 'ceramics', name: 'Ceramics' },
                    { id: 'doors', name: 'Doors' },
                    { id: 'home_items', name: 'Home Items' },
                  ]).map((cat: any) => (
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

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Product Image</label>
                {imagePreview && (
                  <div className="w-full h-32 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden relative mb-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setImageFile(f);
                    if (f) setImagePreview(URL.createObjectURL(f));
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                />
                {imageFile && (
                  <p className="text-xs text-gray-700 mt-1">Selected: {imageFile.name}</p>
                )}
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving || uploading}
                className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${(saving || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
