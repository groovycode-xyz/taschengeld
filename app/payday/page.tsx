import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { Payday } from '@/components/payday';

export default function PaydayPage() {
  return (
    <AppShell>
      <MainLayout>
        <Payday />
      </MainLayout>
    </AppShell>
  );
}
