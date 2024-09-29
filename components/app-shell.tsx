"use client"

import Link from 'next/link'
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { SearchIcon, UserCircle } from 'lucide-react'

export function AppShell() {
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
          <UserCircle className="h-8 w-8" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}