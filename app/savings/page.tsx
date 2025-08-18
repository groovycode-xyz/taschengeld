'use client';

import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { Savings } from '@/components/savings';

export default function SavingsPage() {
  return (
    <AppShell>
      <MainLayout>
        <Savings />
      </MainLayout>
    </AppShell>
  );
}