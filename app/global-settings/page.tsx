import { AppShell } from '@/components/app-shell';
import { MainContent } from '@/components/main-content';
import { GlobalAppSettings } from '@/components/global-app-settings';

export default function GlobalSettingsPage() {
  return (
    <AppShell>
      <MainContent>
        <GlobalAppSettings />
      </MainContent>
    </AppShell>
  );
}
