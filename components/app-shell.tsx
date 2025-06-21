'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sidebar } from '@/components/sidebar';
import { Settings, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/components/context/language-context';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { getTermFor } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on tablets in portrait mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always open on desktop
      } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarOpen(false); // Default closed on tablets
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <TooltipProvider>
      <div className='h-screen flex flex-col'>
        {/* Fixed Header */}
        <header className='h-16 bg-primary text-primary-foreground px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50'>
          <div className='flex items-center space-x-4'>
            {/* Hamburger menu for tablets */}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='lg:hidden text-primary-foreground hover:text-muted-foreground hover:bg-primary/90'
            >
              {sidebarOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
            <Link
              href='/home'
              className='flex items-center space-x-3 hover:opacity-80 transition-opacity'
            >
              <Image
                src='/images/logo/logo-pocket.png'
                alt='Taschengeld'
                width={40}
                height={40}
                className='object-contain'
              />
              <span className='text-2xl font-bold'>
                {getTermFor('Taschengeld', 'Pocket Money')}
              </span>
            </Link>
          </div>
          <div className='flex items-center space-x-6'>
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href='/global-settings' className='block'>
                  <Settings className='h-8 w-8 text-primary-foreground hover:text-muted-foreground transition-colors' />
                </Link>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='hidden lg:block'>
                <p>Global Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content Area */}
        <div className='flex flex-1 pt-16'>
          {/* Responsive Sidebar */}
          <div
            className={`${
              sidebarOpen ? 'w-64' : 'w-0'
            } lg:w-64 fixed left-0 top-16 bottom-0 bg-background border-r border-border transition-all duration-300 overflow-hidden z-40`}
          >
            <div className='w-64'>
              <Sidebar />
            </div>
          </div>

          {/* Overlay for tablets when sidebar is open */}
          {sidebarOpen && (
            <div
              className='lg:hidden fixed inset-0 bg-black/50 z-30 mt-16'
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Scrollable Content Area */}
          <div
            className={`flex-1 ${
              sidebarOpen ? 'lg:ml-64' : 'ml-0'
            } lg:ml-64 overflow-y-auto transition-all duration-300`}
          >
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
