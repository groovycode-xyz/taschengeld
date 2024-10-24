'use client';

import Link from 'next/link';
import { Sidebar } from 'components/sidebar';
import { Settings } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen w-full">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <Link href="/home" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          Taschengeld
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/global-settings" className="mr-4">
            <Settings className="h-8 w-8 text-white hover:text-gray-300 transition-colors" />
          </Link>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8 bg-white">{children}</main>
      </div>
    </div>
  );
}
