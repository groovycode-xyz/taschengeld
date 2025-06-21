'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BackupStatus {
  lastBackupDate: string | null;
  transactionsAtLastBackup: number;
  currentTransactionCount: number;
  newTransactions: number;
  threshold: number;
  reminderEnabled: boolean;
  shouldShowReminder: boolean;
}

export function BackupReminder() {
  const router = useRouter();
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBackupStatus();
    // Check status every 5 minutes
    const interval = setInterval(fetchBackupStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackupStatus = async () => {
    try {
      const response = await fetch('/api/backup/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch backup status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupNow = () => {
    router.push('/global-settings');
    // Scroll to backup section after navigation
    setTimeout(() => {
      const backupSection = document.querySelector('[data-section="backup"]');
      if (backupSection) {
        backupSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Re-show after session ends (page refresh)
  };

  if (isLoading || !status || !status.shouldShowReminder || !isVisible) {
    return null;
  }

  return (
    <>
      <div className='fixed bottom-4 left-4 z-50'>
        <button
          onClick={() => setIsDialogOpen(true)}
          className='relative p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110 animate-pulse'
        >
          <Bell className='h-5 w-5' />
          <span className='absolute -top-1 -right-1 bg-red-700 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center'>
            {status.newTransactions}
          </span>
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Backup Reminder</DialogTitle>
            <DialogDescription>
              You have {status.newTransactions} new transactions since your last backup.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4 space-y-3'>
            <p className='text-sm'>
              It's recommended to backup your data regularly to prevent data loss.
            </p>
            <p className='text-sm text-muted-foreground'>
              If you're seeing this message too often, you can increase the reminder threshold in
              the backup settings (currently set to {status.threshold} transactions).
            </p>
          </div>
          <DialogFooter className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setIsDialogOpen(false);
                handleRemindLater();
              }}
            >
              Dismiss
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                handleBackupNow();
              }}
            >
              To Backup Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
