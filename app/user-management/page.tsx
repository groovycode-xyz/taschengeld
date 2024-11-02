import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { UserManagement } from '@/components/user-management';

export default function UserManagementPage() {
  return (
    <AppShell>
      <MainLayout>
        <UserManagement />
      </MainLayout>
    </AppShell>
  );
}
