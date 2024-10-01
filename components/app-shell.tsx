"use client"

import Link from 'next/link'
import { Sidebar } from "@/components/sidebar"
import { SearchIcon, Settings } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen w-full">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          Taschengeld
        </Link>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white px-4 py-2 rounded-full pl-10 w-64"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Link href="/global-settings" className="mr-4">
            <Settings className="h-6 w-6 text-white hover:text-gray-300 transition-colors" />
          </Link>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}