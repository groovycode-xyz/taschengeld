'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, FileText, PiggyBank, CheckSquare } from 'lucide-react';

interface RestoreConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  backupInfo: {
    type: 'tasks' | 'piggybank' | 'all';
    filename: string;
    date: string;
    counts?: {
      users?: number;
      tasks?: number;
      accounts?: number;
      transactions?: number;
      completedTasks?: number;
    };
  } | null;
}

export function RestoreConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  backupInfo,
}: RestoreConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isValid = confirmText === 'DELETE';

  if (!backupInfo) return null;

  const getIcon = () => {
    switch (backupInfo.type) {
      case 'tasks':
        return <CheckSquare className='h-12 w-12 text-orange-500' />;
      case 'piggybank':
        return <PiggyBank className='h-12 w-12 text-orange-500' />;
      default:
        return <FileText className='h-12 w-12 text-orange-500' />;
    }
  };

  const getTypeLabel = () => {
    switch (backupInfo.type) {
      case 'tasks':
        return 'Tasks';
      case 'piggybank':
        return 'Piggy Bank';
      default:
        return 'Full';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <div className='flex items-center gap-4'>
            {getIcon()}
            <div className='flex-1'>
              <DialogTitle className='text-xl'>Confirm {getTypeLabel()} Restore</DialogTitle>
              <DialogDescription className='mt-1'>{backupInfo.filename}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='rounded-lg bg-muted p-4'>
            <p className='text-sm font-medium mb-2'>Backup Information:</p>
            <ul className='text-sm text-muted-foreground space-y-1'>
              <li>Created: {backupInfo.date}</li>
              {backupInfo.counts && (
                <>
                  {backupInfo.counts.users !== undefined && (
                    <li>• {backupInfo.counts.users} users</li>
                  )}
                  {backupInfo.counts.tasks !== undefined && (
                    <li>• {backupInfo.counts.tasks} tasks</li>
                  )}
                  {backupInfo.counts.completedTasks !== undefined && (
                    <li>• {backupInfo.counts.completedTasks} completed tasks</li>
                  )}
                  {backupInfo.counts.accounts !== undefined && (
                    <li>• {backupInfo.counts.accounts} accounts</li>
                  )}
                  {backupInfo.counts.transactions !== undefined && (
                    <li>• {backupInfo.counts.transactions} transactions</li>
                  )}
                </>
              )}
            </ul>
          </div>

          <div className='rounded-lg bg-destructive/10 border border-destructive/20 p-4'>
            <div className='flex gap-3'>
              <AlertTriangle className='h-5 w-5 text-destructive flex-shrink-0 mt-0.5' />
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-destructive'>
                  This action will permanently delete all current data!
                </p>
                <p className='text-sm text-muted-foreground'>
                  All existing {backupInfo.type === 'all' ? 'data' : getTypeLabel().toLowerCase()}{' '}
                  will be replaced with the backup data. This cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>
              Type <span className='font-mono bg-muted px-1 py-0.5 rounded'>DELETE</span> to
              confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type DELETE to confirm'
              className='font-mono'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onConfirm();
              setConfirmText('');
            }}
            disabled={!isValid}
          >
            Restore from Backup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
