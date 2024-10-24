import { AppShell } from '@/components/app-shell';
import { GlobalAppSettings } from '@/components/global-app-settings';

export default function SettingsPage() {
  return (
    <AppShell>
      <GlobalAppSettings />
    </AppShell>
  );
}
