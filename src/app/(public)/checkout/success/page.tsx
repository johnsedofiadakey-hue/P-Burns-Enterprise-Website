import Link from 'next/link'

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">Thank you for your purchase. We've sent a confirmation email to you.</p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium text-gray-900">#ORD-12345</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>May 11, 2026</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid:</span>
            <span className="font-medium text-gray-900">GH₵ 690.00</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link 
          href="/shop" 
          className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/account" 
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Track Order
        </Link>
      </div>
    </div>
  )
}
