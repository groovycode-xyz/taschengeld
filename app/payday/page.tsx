import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { Payday } from '@/components/payday';

export default function PaydayPage() {
  return (
    <AppShell>
      <MainContent>
        <Payday />
      </MainContent>
    </AppShell>
  );
}
