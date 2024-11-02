import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { TaskManagement } from '@/components/task-management';

export default function TaskManagementPage() {
  return (
    <AppShell>
      <MainLayout>
        <TaskManagement />
      </MainLayout>
    </AppShell>
  );
}
