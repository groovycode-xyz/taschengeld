'use client';

import Link from 'next/link';
import { useMode } from '@/components/context/mode-context';
import { CheckSquare, HandCoins, Banknote, ClipboardList, Users } from 'lucide-react';
import { ParentModeToggle } from './parent-mode-toggle';

export function Sidebar() {
  const { hasFullAccess } = useMode();

  return (
    <div className="w-64 bg-[#C6E7FF] h-full flex flex-col border-r border-[#A5D3FF]">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* Always visible items */}
          <li>
            <Link
              href="/task-completion"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#A5D3FF]/50 transition-colors duration-200"
            >
              <CheckSquare className="h-5 w-5 text-[#2B4C7E]" />
              <span className="text-[#2B4C7E] font-medium">Task Completion</span>
            </Link>
          </li>
          <li>
            <Link
              href="/piggy-bank"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#A5D3FF]/50 transition-colors duration-200"
            >
              <HandCoins className="h-5 w-5 text-[#2B4C7E]" />
              <span className="text-[#2B4C7E] font-medium">Sparkässeli</span>
            </Link>
          </li>

          {/* Divider */}
          <li className="py-2">
            <div className="border-t border-[#A5D3FF]/50"></div>
          </li>

          {/* Parent-only items */}
          {hasFullAccess && (
            <>
              <li>
                <Link
                  href="/payday"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#A5D3FF]/50 transition-colors duration-200"
                >
                  <Banknote className="h-5 w-5 text-[#2B4C7E]" />
                  <span className="text-[#2B4C7E] font-medium">Payday</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/task-management"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#A5D3FF]/50 transition-colors duration-200"
                >
                  <ClipboardList className="h-5 w-5 text-[#2B4C7E]" />
                  <span className="text-[#2B4C7E] font-medium">Task Management</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/user-management"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#A5D3FF]/50 transition-colors duration-200"
                >
                  <Users className="h-5 w-5 text-[#2B4C7E]" />
                  <span className="text-[#2B4C7E] font-medium">Family</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#A5D3FF]">
        <ParentModeToggle />
      </div>
    </div>
  );
}
