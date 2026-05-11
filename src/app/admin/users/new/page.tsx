'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewUserPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('sales_manager')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, email, role })
    alert('User created (mock)')
    router.push('/admin/users')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Staff</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="admin">Admin</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="inventory_manager">Inventory Manager</option>
              <option value="delivery_driver">Delivery Driver</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
