import { TaskCompletionPage } from '@/components/task-completion/task-completion-page';
import { AppShell } from '@/components/app-shell';

export default function TaskCompletionRoute() {
  return (
    <AppShell>
      <TaskCompletionPage />
    </AppShell>
  );
}
