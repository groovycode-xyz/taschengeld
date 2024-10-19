import { AppShell } from 'components/app-shell';
import { MainContent } from 'components/main-content';
import { UserManagement } from 'components/user-management';

export default function UserManagementPage() {
  return (
    <AppShell>
      <MainContent>
        <UserManagement />
      </MainContent>
    </AppShell>
  );
}
