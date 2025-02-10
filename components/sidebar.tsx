'use client';

import Link from 'next/link';
import { useMode } from '@/components/context/mode-context';
import { CheckSquare, HandCoins, Banknote, ClipboardList, Users } from 'lucide-react';
import { ParentModeToggle } from './parent-mode-toggle';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { hasFullAccess } = useMode();

  const linkClasses = cn(
    'flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200',
    'text-foreground/70 hover:text-foreground',
    'bg-accent/0 hover:bg-accent/20'
  );

  return (
    <div className='w-64 bg-card h-full flex flex-col border-r border-border'>
      <nav className='flex-1 p-4'>
        <ul className='space-y-1'>
          {/* Always visible items */}
          <li>
            <Link href='/task-completion' className={linkClasses}>
              <CheckSquare className='h-5 w-5 text-foreground/70 group-hover:text-foreground' />
              <span className='font-medium'>Task Completion</span>
            </Link>
          </li>
          <li>
            <Link href='/piggy-bank' className={linkClasses}>
              <HandCoins className='h-5 w-5 text-foreground/70 group-hover:text-foreground' />
              <span className='font-medium'>Sparkässeli</span>
            </Link>
          </li>

          {/* First divider */}
          <li className='py-2'>
            <div className='border-t border-border'></div>
          </li>

          {/* Parent-only items */}
          {hasFullAccess && (
            <>
              <li>
                <Link href='/payday' className={linkClasses}>
                  <Banknote className='h-5 w-5 text-foreground/70 group-hover:text-foreground' />
                  <span className='font-medium'>Payday</span>
                </Link>
              </li>

              {/* Divider between Payday and Task Management */}
              <li className='py-2'>
                <div className='border-t border-border'></div>
              </li>

              <li>
                <Link href='/task-management' className={linkClasses}>
                  <ClipboardList className='h-5 w-5 text-foreground/70 group-hover:text-foreground' />
                  <span className='font-medium'>Task Management</span>
                </Link>
              </li>
              <li>
                <Link href='/user-management' className={linkClasses}>
                  <Users className='h-5 w-5 text-foreground/70 group-hover:text-foreground' />
                  <span className='font-medium'>Family</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className='p-4'>
        <ParentModeToggle />
      </div>
    </div>
  );
}
