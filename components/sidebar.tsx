import Link from 'next/link'
import { CheckSquareIcon, PiggyBankIcon, BanknoteIcon, ClipboardListIcon, UsersIcon } from 'lucide-react'
import { Switch } from './ui/switch'
import { useState } from 'react'

export function Sidebar() {
  const [isParentMode, setIsParentMode] = useState(true)

  return (
    <aside className="w-64 bg-gray-100 h-full flex-shrink-0 flex flex-col">
      <nav className="mt-4 flex-grow">
        <Link href="/task-completion" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <CheckSquareIcon className="mr-3 h-5 w-5" />
          <span>Task Completion</span>
        </Link>
        <Link href="/piggy-bank" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <PiggyBankIcon className="mr-3 h-5 w-5" />
          <span>Piggy Bank</span>
        </Link>
        <Link href="/payday" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <BanknoteIcon className="mr-3 h-5 w-5" />
          <span>Payday</span>
        </Link>
        <Link href="/task-management" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <ClipboardListIcon className="mr-3 h-5 w-5" />
          <span>Task Management</span>
        </Link>
        <Link href="/user-management" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <UsersIcon className="mr-3 h-5 w-5" />
          <span>User Management</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {isParentMode ? 'Parent' : 'Child'} Mode
          </span>
          <Switch
            checked={isParentMode}
            onCheckedChange={setIsParentMode}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>
    </aside>
  )
}