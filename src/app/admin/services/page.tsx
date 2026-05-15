'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rate, setRate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      showToast("Error fetching services", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed initial services? This will add duplicate items if already seeded.')) return;
    setLoading(true);
    try {
      const initialServices = [
        { name: 'Windows Supply & Installation', description: 'We source and install high-quality windows for residential and commercial buildings. Our team ensures precise measurement and perfect fit.', rate: 'Varies', status: 'Active', createdAt: new Date().toISOString() },
        { name: 'General Supply Contracts', description: 'We handle bulk supply contracts for construction projects. Ceramics, doors, and other hardware items in large quantities.', rate: 'Varies', status: 'Active', createdAt: new Date().toISOString() },
      ]
      
      for (const serv of initialServices) {
        await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serv)
        });
      }
      
      showToast("Seeded initial services successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error seeding services:", error);
      showToast("Error seeding services", "error")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          rate: parseFloat(rate),
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create service');
      }
      
      showToast('Service added successfully!');
      setShowModal(false);
      // Reset form
      setName('');
      setDescription('');
      setRate('');
      fetchServices();
    } catch (error: any) {
      console.error("Error adding service:", error);
      showToast('Error adding service: ' + error.message, 'error');
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (service: any) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setRate(service.rate.toString());
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          rate: parseFloat(rate),
          updatedAt: new Date().toISOString()
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update service');
      }
      
      showToast('Service updated successfully!');
      setShowEditModal(false);
      setEditingService(null);
      setName('');
      setDescription('');
      setRate('');
      fetchServices();
    } catch (error: any) {
      console.error("Error updating service:", error);
      showToast('Error updating service: ' + error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete service');
      }

      showToast('Service deleted successfully!');
      fetchServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      showToast('Error deleting service: ' + error.message, 'error');
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
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Services</h2>
          <p className="text-sm text-gray-700">Manage rates for additional services like transport and loading</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            className="px-4 py-3 bg-gold-600 text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/20"
          >
            Seed Initial Data
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20"
          >
            Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-700 text-sm">Loading services...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">Rate</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-700 text-sm">No services found.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">GH₵ {typeof service.rate === 'number' ? service.rate.toFixed(2) : parseFloat(service.rate || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="text-gold-600 hover:text-gold-700 font-bold uppercase text-xs tracking-wider mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="text-red-500 hover:text-red-700 font-bold uppercase text-xs tracking-wider"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-in Modal for Add Service */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${showModal ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-serif font-bold text-[#111111]">Add New Service</h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-[#111111] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5 h-[calc(100%-73px)] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Service Name</label>
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
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Rate (GH₵)</label>
              <input 
                type="number" 
                step="0.01"
                value={rate} 
                onChange={(e) => setRate(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Slide-in Modal for Edit Service */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${showEditModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${showEditModal ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-serif font-bold text-[#111111]">Edit Service</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setEditingService(null);
                setName('');
                setDescription('');
                setRate('');
              }}
              className="text-gray-400 hover:text-[#111111] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleUpdate} className="p-6 space-y-5 h-[calc(100%-73px)] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Service Name</label>
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
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Rate (GH₵)</label>
              <input 
                type="number" 
                step="0.01"
                value={rate} 
                onChange={(e) => setRate(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all" 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 bg-[#111111] text-white font-bold uppercase tracking-wider text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? 'Updating...' : 'Update Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
