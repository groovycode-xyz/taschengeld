'use client';

import React from 'react';
import { ParentChildModeProvider } from '@/hooks/useParentChildMode';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ParentChildModeProvider>{children}</ParentChildModeProvider>;
}
