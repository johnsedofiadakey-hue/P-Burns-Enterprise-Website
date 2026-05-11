import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-emerald-800">
          P-Burns Admin
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="/admin" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Dashboard</a>
          <a href="/admin/products" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Products</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Categories</a>
          <a href="/admin/orders" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Orders</a>
          <a href="/admin/customers" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Customers</a>
          <a href="/admin/pre-orders" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Pre-Orders</a>
          <a href="/admin/contracts" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Contracts</a>
          <a href="/admin/services" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Services</a>
          <a href="/admin/invoices" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Invoices</a>
          <a href="/admin/bookkeeping" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Bookkeeping</a>
          <a href="/admin/suppliers" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Suppliers</a>
          <a href="/admin/reports" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Reports</a>
          <a href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Users</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-emerald-800">Settings</a>
        </nav>
        <div className="p-4 border-t border-emerald-800">
          <div className="text-sm truncate">{session.user?.email}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
          <div>
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
