'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      window.location.href = '/admin'
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] relative overflow-hidden w-full">
      {/* Decorative background gradients */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-gold-500 opacity-10 filter blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-gold-500 opacity-10 filter blur-3xl rounded-full"></div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl relative z-10 m-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold-600 transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to site
          </Link>
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest">Admin Portal</span>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-[#111111]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Log in to manage your empire</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
              placeholder="admin@pburns.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-[#111111] text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gold-600 transition-colors shadow-lg shadow-charcoal-900/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
