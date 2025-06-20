import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from 'components/client-layout';
import { ToastProvider } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/components/context/settings-context';
import { UserProvider } from '@/components/context/user-context';
import { ModeProvider } from '@/components/context/mode-context';
import { LanguageProvider } from '@/components/context/language-context';
import { ThemeProvider } from '@/components/context/theme-context';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Taschengeld - Family Allowance Tracker',
  description: 'A kid-friendly allowance and task tracking application',
  icons: {
    icon: [
      { url: '/favicon-pocket.ico' },
      { url: '/images/icons/icon-pocket-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/icons/icon-pocket-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/icons/icon-pocket-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/icons/icon-pocket-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/icons/icon-pocket-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/icons/apple-touch-icon-pocket.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <SettingsProvider>
              <UserProvider>
                <ModeProvider>
                  <LanguageProvider>
                    <ThemeProvider defaultTheme='system'>
                      <ClientLayout>{children}</ClientLayout>
                    </ThemeProvider>
                  </LanguageProvider>
                </ModeProvider>
              </UserProvider>
            </SettingsProvider>
            <Toaster />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
