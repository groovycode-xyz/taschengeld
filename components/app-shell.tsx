'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className='flex flex-col h-screen w-full'>
      <header className='bg-primary text-primary-foreground p-4 flex justify-between items-center'>
        <Link
          href='/home'
          className='text-2xl font-bold hover:text-muted-foreground transition-colors'
        >
          Taschengeld
        </Link>
        <div className='flex items-center space-x-6'>
          <ThemeToggle />
          <Link href='/global-settings'>
            <Settings className='h-8 w-8 text-primary-foreground hover:text-muted-foreground transition-colors' />
          </Link>
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 bg-background'>{children}</div>
      </div>
    </div>
  );
}
