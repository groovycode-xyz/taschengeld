import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { PiggyBank } from '@/components/piggy-bank';

export default function PiggyBankPage() {
  return (
    <AppShell>
      <MainContent>
        <PiggyBank />
      </MainContent>
    </AppShell>
  );
}
