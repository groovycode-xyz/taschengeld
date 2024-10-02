import { TaskCompletionPage } from '@/components/TaskCompletion/TaskCompletionPage';
import { AppShell } from '@/components/app-shell';

export default function TaskCompletionRoute() {
  return (
    <AppShell>
      <TaskCompletionPage />
    </AppShell>
  );
}