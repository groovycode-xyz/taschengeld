import React from 'react';
import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { PiggyBankV2 } from '@/components/piggy-bank-v2';

export default function PiggyBankPage() {
  return (
    <AppShell>
      <MainContent>
        <PiggyBankV2 />
      </MainContent>
    </AppShell>
  );
}
