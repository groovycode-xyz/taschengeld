import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from 'components/client-layout'; // Corrected import path

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tascheged - Allowance Tracker',
  description: 'A kid-friendly allowance and task tracking application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
