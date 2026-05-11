import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Sales Report</h3>
          <p className="text-gray-500 text-sm mb-4">View sales by date range, category, or product.</p>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Generate Report &rarr;</button>
        </div>

        {/* Contract Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Contract Report</h3>
          <p className="text-gray-500 text-sm mb-4">Active, completed, and cancelled contracts summary.</p>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Generate Report &rarr;</button>
        </div>

        {/* Financial Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Profit & Loss</h3>
          <p className="text-gray-500 text-sm mb-4">Revenue vs Expenses breakdown by month.</p>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Generate Report &rarr;</button>
        </div>

        {/* Inventory Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Stock Report</h3>
          <p className="text-gray-500 text-sm mb-4">Low stock alerts and inventory valuation.</p>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Generate Report &rarr;</button>
        </div>
      </div>
    </div>
  )
}
