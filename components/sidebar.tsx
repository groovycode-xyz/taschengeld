'use client';

import Link from 'next/link';
import {
  CheckSquareIcon,
  HandCoinsIcon,
  BanknoteIcon,
  ClipboardListIcon,
  UsersIcon,
} from 'lucide-react';
import { useMode } from '@/components/context/mode-context';
import { ParentModeToggle } from '@/components/parent-mode-toggle';

export function Sidebar() {
  const { hasFullAccess } = useMode();

  return (
    <div className="w-64 bg-gray-100 h-full flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Always visible */}
          <li>
            <Link
              href="/task-completion"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200"
            >
              <CheckSquareIcon className="h-5 w-5" />
              <span>Task Completion</span>
            </Link>
          </li>
          <li>
            <Link
              href="/piggy-bank"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200"
            >
              <HandCoinsIcon className="h-5 w-5" />
              <span>Sparkässeli</span>
            </Link>
          </li>

          {/* Only visible when roles are not enforced OR in Parent mode */}
          {hasFullAccess && (
            <>
              <li>
                <Link
                  href="/payday"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200"
                >
                  <BanknoteIcon className="h-5 w-5" />
                  <span>Payday</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/task-management"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200"
                >
                  <ClipboardListIcon className="h-5 w-5" />
                  <span>Task Management</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/user-management"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200"
                >
                  <UsersIcon className="h-5 w-5" />
                  <span>Family</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Add the mode toggle at the bottom */}
      <ParentModeToggle />
    </div>
  );
}
