'use client';

import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return <main className="flex-1 overflow-auto p-8 bg-white">{children}</main>;
}
