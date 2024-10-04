import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { TaskManagement } from '@/components/task-management';

export default function TaskManagementPage() {
  return (
    <AppShell>
      <MainContent>
        <TaskManagement />
      </MainContent>
    </AppShell>
  );
}
