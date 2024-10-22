import React from 'react';
import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { TaskCompletion } from '@/components/task-completion';

export default function TaskCompletionPage() {
  return (
    <AppShell>
      <MainContent>
        <TaskCompletion />
      </MainContent>
    </AppShell>
  );
}
