'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';

type ResetType = 'users' | 'tasks' | 'accounts';

interface ResetDialogState {
  isOpen: boolean;
  type: ResetType | null;
}

export function GlobalAppSettings() {
  const [enforceRoles, setEnforceRoles] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    users: false,
    tasks: false,
    accounts: false,
  });
  const [resetDialog, setResetDialog] = useState<ResetDialogState>({
    isOpen: false,
    type: null,
  });
  const { addToast: toast } = useToast();

  const getResetDialogProps = (type: ResetType) => {
    const props = {
      users: {
        title: 'Reset All Users',
        description:
          'This will delete all users from the system. The default built-in Parent User will be recreated automatically. This action cannot be undone.',
      },
      tasks: {
        title: 'Reset All Tasks',
        description:
          'This will delete all tasks and their completion history. You will need to create new tasks. This action cannot be undone.',
      },
      accounts: {
        title: 'Reset All Piggy Bank Accounts',
        description:
          'This will delete all bank accounts and their transaction history. This action cannot be undone.',
      },
    };
    return props[type];
  };

  const handleResetClick = (type: ResetType) => {
    setResetDialog({ isOpen: true, type });
  };

  const handleResetConfirm = () => {
    const type = resetDialog.type;
    if (!type) return;

    // Set loading state immediately
    setLoadingStates((prev) => ({ ...prev, [type]: true }));

    // Close dialog immediately to show the loading state
    setResetDialog({ isOpen: false, type: null });

    // Simulate reset action with longer delay to see the spinner
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [type]: false }));

      toast({
        title: 'Reset Successful',
        description: `Successfully reset ${type}. You may need to refresh the page to see the changes.`,
        variant: 'default',
      });
    }, 2000); // Increased to 2 seconds to make the loading state more visible
  };

  const handleCurrencyChange = (value: string) => {
    toast({
      title: 'Currency Updated',
      description: `Default currency has been set to ${value}`,
      variant: 'default',
    });
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 4) {
      toast({
        title: 'PIN Updated',
        description: 'Global PIN has been updated successfully',
        variant: 'default',
      });
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold mb-4">Global App Settings</h1>

      {/* Role Enforcement Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enforce Parent/Child Roles</Label>
            <p className="text-sm text-muted-foreground">
              This is for those people who do not want to &ldquo;mess&rdquo; with toggling between
              Parent mode and verifying they are a Parent.
            </p>
          </div>
          <Switch checked={enforceRoles} onCheckedChange={setEnforceRoles} />
        </div>

        {enforceRoles && (
          <div className="ml-6">
            <Label htmlFor="pin">Global PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              className="w-32 mt-2"
              onChange={handlePinChange}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use this PIN to enter Global Settings and verify Parent mode.
            </p>
          </div>
        )}
      </div>

      {/* Default Currency Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Default Currency</h2>
        <Select onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="CHF">CHF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Reset Options</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              Warning: These options will have irreversible consequences. Do not use unless you are
              aware that you will need to recreate any data that is deleted by taking these actions.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Button
              variant="outline"
              className="w-full mb-1"
              onClick={() => handleResetClick('users')}
              disabled={loadingStates.users}
            >
              {loadingStates.users && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset and erase all Users
            </Button>
            <p className="text-sm text-muted-foreground">
              Will delete all users. Not reversible. You will need to create new users. The default
              built-in Parent User will be recreated automatically.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full mb-1"
              onClick={() => handleResetClick('tasks')}
              disabled={loadingStates.tasks}
            >
              {loadingStates.tasks && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset and erase all Tasks
            </Button>
            <p className="text-sm text-muted-foreground">
              Will delete all currently defined Tasks, as well as all Task completion history. Not
              reversible. You will need to create new Tasks.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full mb-1"
              onClick={() => handleResetClick('accounts')}
              disabled={loadingStates.accounts}
            >
              {loadingStates.accounts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset and erase all Piggy Bank Account Balances
            </Button>
            <p className="text-sm text-muted-foreground">
              Will delete all Bank Accounts of all users. Will delete all transactions and history.
              Not reversible.
            </p>
          </div>
        </div>
      </div>
      {resetDialog.type && (
        <ConfirmDialog
          isOpen={resetDialog.isOpen}
          onClose={() => setResetDialog({ isOpen: false, type: null })}
          onConfirm={handleResetConfirm}
          {...getResetDialogProps(resetDialog.type)}
          confirmText="Yes, Reset"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
