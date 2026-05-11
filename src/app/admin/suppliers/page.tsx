import Link from 'next/link'

// Mock data
const suppliers = [
  { id: '1', name: 'China Ceramics Co.', contact: 'Mr. Wang', country: 'China', type: 'Ceramics' },
  { id: '2', name: 'Local Door Ltd.', contact: 'Kofi Mensah', country: 'Ghana', type: 'Doors' },
]

export default function SuppliersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <Link 
          href="/admin/suppliers/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Add Supplier
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.country}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/suppliers/${supplier.id}/edit`} className="text-emerald-600 hover:text-emerald-900 mr-4">Edit</Link>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
