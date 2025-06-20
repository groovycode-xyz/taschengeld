'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/context/language-context';
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
  const { getTermFor } = useLanguage();
  const { toggleParentMode, isParentMode, enforceRoles } = useMode();

  return (
    <nav className='h-full flex flex-col'>
      <div className='flex-1 py-4'>
        <div className='space-y-2 px-3'>
          <Link
            href='/task-completion'
            className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
          >
            <CheckSquare className='h-6 w-6 md:h-5 md:w-5' />
            <span className='text-base md:text-sm'>Task Completion</span>
          </Link>

          <Link
            href='/piggy-bank'
            className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
          >
            <PiggyBank className='h-6 w-6 md:h-5 md:w-5' />
            <span className='text-base md:text-sm'>{getTermFor('Sparkässeli', 'Piggy Bank')}</span>
          </Link>

          {(!enforceRoles || isParentMode) && (
            <>
              <Link
                href='/payday'
                className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
              >
                <HandCoins className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>{getTermFor('Zahltag', 'Payday')}</span>
              </Link>

              <Link
                href='/task-management'
                className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
              >
                <ListTodo className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Task Management</span>
              </Link>

              <Link
                href='/family'
                className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
              >
                <Users className='h-6 w-6 md:h-5 md:w-5' />
                <span className='text-base md:text-sm'>Family</span>
              </Link>

              <Link
                href='/global-settings'
                className='flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target'
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
          className={`w-full flex items-center space-x-3 px-3 py-3 md:py-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-all touch-target ${
            !enforceRoles ? 'opacity-50' : ''
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
