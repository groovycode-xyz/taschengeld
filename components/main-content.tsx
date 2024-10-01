"use client"

import { usePathname } from 'next/navigation'
import { TaskCompletion } from './task-completion'
import { PiggyBank } from './piggy-bank'
import { Payday } from './payday'
import { TaskManagement } from './task-management'
import { UserManagement } from './user-management'
import { GlobalAppSettings } from './global-app-settings'

export function MainContent() {
  const pathname = usePathname()

  const renderContent = () => {
    switch (pathname) {
      case '/task-completion':
        return <TaskCompletion />
      case '/piggy-bank':
        return <PiggyBank />
      case '/payday':
        return <Payday />
      case '/task-management':
        return <TaskManagement />
      case '/user-management':
        return <UserManagement />
      case '/global-settings':
        return <GlobalAppSettings />
      default:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Welcome to Taschengeld</h2>
            <p>Select a feature from the sidebar to get started.</p>
          </>
        )
    }
  }

  return (
    <main className="flex-1 overflow-auto p-8 bg-white">
      {renderContent()}
    </main>
  )
}