import Link from 'next/link';
import {
  CheckSquareIcon,
  HandCoinsIcon,
  BanknoteIcon,
  ClipboardListIcon,
  UsersIcon,
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-gray-100 to-gray-200 h-full flex-shrink-0 flex flex-col shadow-lg rounded-r-lg">
      <nav className="mt-4 flex-grow space-y-2 px-4">
        <Link
          href="/task-completion"
          className="flex items-center px-6 py-4 text-gray-700 bg-gray-300 rounded-lg transition-colors active:bg-gray-400"
        >
          <CheckSquareIcon className="mr-4 h-8 w-8" />
          <span className="text-lg">Task Completion</span>
        </Link>
        <Link
          href="/piggy-bank"
          className="flex items-center px-6 py-4 text-gray-700 bg-gray-300 rounded-lg transition-colors active:bg-gray-400"
        >
          <HandCoinsIcon className="mr-4 h-8 w-8" />
          <span className="text-lg">Sparkässeli</span>
        </Link>
        <Link
          href="/payday"
          className="flex items-center px-6 py-4 text-gray-700 bg-gray-300 rounded-lg transition-colors active:bg-gray-400"
        >
          <BanknoteIcon className="mr-4 h-8 w-8" />
          <span className="text-lg">Payday</span>
        </Link>
        <Link
          href="/task-management"
          className="flex items-center px-6 py-4 text-gray-700 bg-gray-300 rounded-lg transition-colors active:bg-gray-400"
        >
          <ClipboardListIcon className="mr-4 h-8 w-8" />
          <span className="text-lg">Task Management</span>
        </Link>
        <Link
          href="/user-management"
          className="flex items-center px-6 py-4 text-gray-700 bg-gray-300 rounded-lg transition-colors active:bg-gray-400"
        >
          <UsersIcon className="mr-4 h-8 w-8" />
          <span className="text-lg">Family</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-300">
        {/* Parent/Child mode toggle has been removed */}
      </div>
    </aside>
  );
}
