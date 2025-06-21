'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '@/components/context/mode-context';
import {
  CheckSquare,
  HandCoins,
  PiggyBank,
  ListTodo,
  Users,
  SwitchCamera,
  Settings,
} from 'lucide-react';

export function Sidebar() {
  const { toggleParentMode, isParentMode, enforceRoles } = useMode();
  const pathname = usePathname();

  return (
    <nav className='h-full flex flex-col'>
      <div className='flex-1 py-4'>
        <div className='space-y-2 px-3'>
          <Link
            href='/task-completion'
            className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
              pathname === '/task-completion'
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
            }`}
          >
            <CheckSquare className='h-6 w-6 md:h-5 md:w-5' />
            <span className='text-base md:text-sm'>Task Completion</span>
          </Link>

          <Link
            href='/piggy-bank'
            className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
              pathname === '/piggy-bank'
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
            }`}
          >
            <PiggyBank className='h-6 w-6 md:h-5 md:w-5' />
            <span className='text-base md:text-sm'>Piggy Bank</span>
          </Link>

          {(!enforceRoles || isParentMode) && (
            <>
              <Link
                href='/payday'
                className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
                  pathname === '/payday'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
                }`}
              >
                <HandCoins className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Payday</span>
              </Link>

              <Link
                href='/task-management'
                className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
                  pathname === '/task-management'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
                }`}
              >
                <ListTodo className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Task Management</span>
              </Link>

              <Link
                href='/family'
                className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
                  pathname === '/family'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
                }`}
              >
                <Users className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Family</span>
              </Link>

              <Link
                href='/global-settings'
                className={`flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
                  pathname === '/global-settings'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
                }`}
              >
                <Settings className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Settings</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mode Toggle - Fixed to bottom */}
      <div className='px-3 py-4 border-t'>
        <button
          onClick={() => toggleParentMode()}
          className={`w-full flex items-center space-x-3 px-3 py-4 md:py-3 rounded-lg border-2 transition-all touch-target ${
            !enforceRoles
              ? 'opacity-50 border-border'
              : 'border-border hover:bg-muted hover:border-muted-foreground/20 active:bg-muted/80'
          }`}
          disabled={!enforceRoles}
        >
          <SwitchCamera className='h-6 w-6 md:h-5 md:w-5' />
          <span className='text-base md:text-sm'>
            {enforceRoles
              ? `Switch to ${isParentMode ? 'Child' : 'Parent'} Mode`
              : 'Mode Toggle (Disabled)'}
          </span>
        </button>
      </div>
    </nav>
  );
}
