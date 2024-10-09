'use client';

import React from 'react';
import { ParentChildModeProvider } from '@/hooks/useParentChildMode';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ParentChildModeProvider>{children}</ParentChildModeProvider>;
};

export default ClientLayout;
