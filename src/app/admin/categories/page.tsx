'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedCategories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Error fetching categories", "error")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter(c => c.id !== id));
      showToast("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("Error deleting category", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await addDoc(collection(db, "categories"), {
        name,
        description,
        createdAt: new Date().toISOString()
      });
      
      showToast('Category created successfully!');
      setIsModalOpen(false);
      // Reset form
      setName('');
      setDescription('');
      
      // Refresh list
      fetchCategories();
    } catch (error: any) {
      console.error("Error adding category:", error);
      showToast('Error creating category: ' + error.message, "error");
    } finally {
      setSaving(false)
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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Categories</h2>
          <p className="text-sm text-gray-500">Manage your product categories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400 font-medium">Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400 font-medium">No categories found.</td>
              </tr>
            ) : categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold flex gap-4">
                  <Link href={`/admin/categories/${category.id}/edit`} className="text-gold-600 hover:text-gold-700 transition-colors">Edit</Link>
                  <button 
                    onClick={() => handleDelete(category.id)}
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

      {/* Slide-in Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content - Slide in from right */}
          <div className="bg-white w-full max-w-md h-screen shadow-2xl relative z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">Add New Category</h3>
                <p className="text-xs text-gray-500 mt-1">Create a new product category</p>
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="e.g. Luxury Ceramics"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
                  placeholder="Describe what items belong in this category..."
                />
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex-1 px-4 py-3 bg-[#111111] text-white font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
