'use client';

import Link from 'next/link';
import { useMode } from '@/components/context/mode-context';
import { CheckSquare, HandCoins, Banknote, ClipboardList, Users } from 'lucide-react';
import { ParentModeToggle } from './parent-mode-toggle';

export function Sidebar() {
  const { hasFullAccess } = useMode();

  return (
    <div className='w-64 bg-gray-900 h-full flex flex-col border-r border-gray-800'>
      <nav className='flex-1 p-4'>
        <ul className='space-y-1'>
          {/* Always visible items */}
          <li>
            <Link
              href='/task-completion'
              className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200'
            >
              <CheckSquare className='h-5 w-5 text-white' />
              <span className='text-white font-medium'>Task Completion</span>
            </Link>
          </li>
          <li>
            <Link
              href='/piggy-bank'
              className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200'
            >
              <HandCoins className='h-5 w-5 text-white' />
              <span className='text-white font-medium'>Sparkässeli</span>
            </Link>
          </li>

          {/* Divider */}
          <li className='py-2'>
            <div className='border-t border-gray-800'></div>
          </li>

          {/* Parent-only items */}
          {hasFullAccess && (
            <>
              <li>
                <Link
                  href='/payday'
                  className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200'
                >
                  <Banknote className='h-5 w-5 text-white' />
                  <span className='text-white font-medium'>Payday</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/task-management'
                  className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200'
                >
                  <ClipboardList className='h-5 w-5 text-white' />
                  <span className='text-white font-medium'>Task Management</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/user-management'
                  className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200'
                >
                  <Users className='h-5 w-5 text-white' />
                  <span className='text-white font-medium'>Family</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className='p-4 border-t border-gray-800'>
        <ParentModeToggle />
      </div>
    </div>
  );
}
