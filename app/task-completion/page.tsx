import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { TaskCompletion } from '@/components/task-completion';

export default function TaskCompletionPage() {
  return (
    <AppShell>
      <MainLayout>
        <TaskCompletion />
      </MainLayout>
    </AppShell>
  );
}
