import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"
import Sidebar from "@/components/Sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar email={session?.user?.email} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Spacer for mobile hamburger */}
            <div className="w-10 lg:hidden"></div>
            <h1 className="text-xl font-bold text-[#111111] uppercase tracking-wide">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-[#111111] font-bold text-sm">
                {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
              <span className="text-sm text-gray-600 font-medium">{session?.user?.email}</span>
            </div>
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
