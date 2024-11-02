'use client';

import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return <main className={cn('flex-1 overflow-auto p-8 bg-[#D4F6FF]', className)}>{children}</main>;
}
