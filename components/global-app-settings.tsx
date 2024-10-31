'use client';

import React, { useState, useEffect } from 'react';
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
import {
  Download,
  Upload,
  Save,
  AlertCircle,
  Loader2,
  Settings2,
  Shield,
  Coins,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { saveAs } from 'file-saver';
import { useMode } from '@/components/context/mode-context';
import { Input } from '@/components/ui/input';
import { PinSetupDialog } from '@/components/pin-setup-dialog';
import Link from 'next/link';
import { ResetTransactionsDialog } from '@/components/reset-transactions-dialog';

type ResetType = 'users' | 'tasks' | 'transactions' | 'all';

interface ResetDialogState {
  isOpen: boolean;
  type: ResetType | null;
}

interface TaskBackup {
  title: string;
  description: string;
  icon_name: string;
  sound_url: string;
  payout_value: string;
  is_active: boolean;
}

interface CompletedTaskBackup {
  user_id: number;
  description: string;
  payout_value: string;
  comment: string;
  attachment: string;
  payment_status: string;
}

interface UserBackup {
  name: string;
  icon: string;
  soundurl: string;
  birthday: string;
  role: string;
}

interface AccountBackup {
  account_number: string;
  balance: string;
  user_name: string;
}

interface TransactionBackup {
  amount: string;
  transaction_type: string;
  description: string;
  photo: string | null;
  user_name: string;
  transaction_date: string;
}

interface BackupData {
  timestamp: string;
  type: 'tasks' | 'users' | 'piggybank' | 'all';
  data: {
    tasks?: {
      tasks: TaskBackup[];
      completed_tasks: CompletedTaskBackup[];
    };
    users?: {
      users: UserBackup[];
    };
    piggybank?: {
      accounts: AccountBackup[];
      transactions: TransactionBackup[];
    };
    all?: {
      users: UserBackup[];
      tasks: TaskBackup[];
      accounts: AccountBackup[];
      transactions: TransactionBackup[];
    };
  };
}

export function GlobalAppSettings() {
  const { enforceRoles, setEnforceRoles, pin, setPin, verifyPin } = useMode(); // Add verifyPin
  const { addToast: toast } = useToast();
  const [loadingStates, setLoadingStates] = useState({
    users: false,
    tasks: false,
    all: false,
    transactions: false,
  });
  const [resetDialog, setResetDialog] = useState<ResetDialogState>({
    isOpen: false,
    type: null,
  });
  const [loadingBackup, setLoadingBackup] = useState({
    tasks: false,
    users: false,
    piggybank: false,
    all: false,
  });
  const [loadingRestore, setLoadingRestore] = useState({
    tasks: false,
    users: false,
    piggybank: false,
    all: false,
  });
  const [disableRolesDialog, setDisableRolesDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [showPin, setShowPin] = useState(false);
  const [isPinClearDialogOpen, setIsPinClearDialogOpen] = useState(false);
  const [isConfigureFlashing, setIsConfigureFlashing] = useState(false);
  const [isResetTransactionsOpen, setIsResetTransactionsOpen] = useState(false);
  const [loadingCurrency, setLoadingCurrency] = useState(false);

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const response = await fetch('/api/settings/currency');
        if (response.ok) {
          const data = await response.json();
          setSelectedCurrency(data.currency);
        }
      } catch (error) {
        console.error('Failed to load currency setting:', error);
        toast({
          title: 'Error',
          description: 'Failed to load currency setting',
          variant: 'destructive',
        });
      }
    };

    loadCurrency();
  }, []);

  const handleRoleEnforcementChange = (checked: boolean) => {
    if (!checked && enforceRoles) {
      setDisableRolesDialog(true);
    } else {
      setEnforceRoles(checked);
      toast({
        title: 'Settings Updated',
        description: `Parent/Child role enforcement is now ${checked ? 'enabled' : 'disabled'}`,
      });
    }
  };

  const getResetDialogProps = (type: ResetType) => {
    const props = {
      users: {
        title: 'Reset All Users',
        description:
          'This will delete all users from the system, including their piggy bank accounts, completed tasks, and transaction history. This action cannot be undone.',
      },
      tasks: {
        title: 'Reset All Tasks',
        description:
          'This will delete all tasks and their completion history. Existing transactions will remain unchanged with their original descriptions and amounts. You will need to create new tasks. This action cannot be undone.',
      },
      transactions: {
        title: 'Reset Transaction History',
        description: (
          <>
            This will delete all transaction history from{' '}
            <Link href="/piggy-bank" className="text-blue-600 hover:underline">
              all accounts
            </Link>{' '}
            and reset their balances to zero. Not reversible.
          </>
        ),
      },
      all: {
        title: 'Reset Entire Database',
        description: (
          <>
            This will delete all data from the database. This includes all users, tasks, accounts,
            and their related data. This action cannot be undone.
          </>
        ),
      },
    };
    return props[type];
  };

  const handleResetClick = (type: ResetType) => {
    if (type === 'transactions') {
      setIsResetTransactionsOpen(true);
    } else {
      setResetDialog({ isOpen: true, type });
    }
  };

  const handleResetConfirm = async () => {
    const type = resetDialog.type;
    if (!type) return;

    setLoadingStates((prev) => ({ ...prev, [type]: true }));
    setResetDialog({ isOpen: false, type: null });

    try {
      const response = await fetch(`/api/reset/${type}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Reset failed');
      }

      toast({
        title: 'Reset Successful',
        description: `Successfully reset ${type}. You may need to refresh the page to see the changes.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Reset failed:', error);
      toast({
        title: 'Reset Failed',
        description: `Failed to reset ${type}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleCurrencyChange = async (value: string) => {
    setLoadingCurrency(true);
    try {
      const response = await fetch('/api/settings/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: value }),
      });

      if (!response.ok) throw new Error('Failed to update currency');

      setSelectedCurrency(value);
      toast({
        title: 'Currency Updated',
        description: `Default currency has been set to ${value}`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to update currency:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update currency setting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCurrency(false);
    }
  };

  const handleBackup = async (type: 'tasks' | 'users' | 'piggybank' | 'all') => {
    setLoadingBackup((prev) => ({ ...prev, [type]: true }));

    try {
      // Fetch data based on type
      const response = await fetch(`/api/backup/${type}`);
      if (!response.ok) throw new Error(`Failed to backup ${type} data`);

      const data = await response.json();

      // Create backup data structure
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        type,
        data: {
          [type]: data,
        },
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      saveAs(blob, `taschengeld-${type}-backup-${new Date().toISOString()}.json`);

      toast({
        title: 'Backup Successful',
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } data has been backed up successfully.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Backup failed:', error);
      toast({
        title: 'Backup Failed',
        description: `Failed to backup ${type} data. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoadingBackup((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRestore = async (type: 'tasks' | 'users' | 'piggybank' | 'all') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setLoadingRestore((prev) => ({ ...prev, [type]: true }));

      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };

          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };

          reader.readAsText(file);
        });

        // Parse and validate the backup data
        let backupData: BackupData;
        try {
          backupData = JSON.parse(content);
        } catch {
          throw new Error('Invalid backup file format. File must be a valid JSON file.');
        }

        // Validate backup data structure
        if (!backupData.type || !backupData.timestamp || !backupData.data) {
          throw new Error(
            'Invalid backup file structure. File appears to be corrupted or not a valid backup.'
          );
        }

        // Validate backup type
        if (backupData.type !== type) {
          throw new Error(
            `Please select a ${type} backup file. You selected a ${backupData.type} backup file.`
          );
        }

        // Validate data content based on type
        switch (type) {
          case 'tasks':
            if (!backupData.data.tasks?.tasks) {
              throw new Error('Invalid tasks backup file. No task data found.');
            }
            break;
          case 'users':
            if (!backupData.data.users?.users) {
              throw new Error('Invalid users backup file. No user data found.');
            }
            break;
          case 'piggybank':
            if (!backupData.data.piggybank?.accounts) {
              throw new Error('Invalid piggy bank backup file. No account data found.');
            }
            break;
          case 'all':
            if (!backupData.data.all?.users || !backupData.data.all?.tasks) {
              throw new Error('Invalid full backup file. Missing required data.');
            }
            break;
        }

        // If we get here, the file is valid - proceed with restore
        const response = await fetch(`/api/restore/${type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backupData.data[type]),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to restore data');
        }

        toast({
          title: 'Restore Successful',
          description: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } data has been restored successfully.`,
          variant: 'default',
        });
      } catch (error) {
        console.error('Restore failed:', error);
        toast({
          title: 'Restore Failed',
          description: error instanceof Error ? error.message : 'Failed to restore data',
          variant: 'destructive',
        });
      } finally {
        setLoadingRestore((prev) => ({ ...prev, [type]: false }));
      }
    };

    input.click();
  };

  const handleTestPin = () => {
    const inputPin = prompt('Enter PIN to test:');
    if (inputPin) {
      if (verifyPin(inputPin)) {
        toast({
          title: 'PIN Test Successful',
          description: 'The entered PIN is correct.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'PIN Test Failed',
          description: 'The entered PIN is incorrect.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleClearPin = () => {
    setIsPinClearDialogOpen(true);
  };

  const confirmClearPin = () => {
    setPin(null);
    setIsPinClearDialogOpen(false);
    toast({
      title: 'PIN Removed',
      description: 'The global PIN has been cleared.',
      variant: 'default',
    });
  };

  const handlePinFieldClick = () => {
    if (!pin) {
      console.log('PIN field clicked, triggering animation'); // Add this line
      setIsConfigureFlashing(true);
      setTimeout(() => {
        console.log('Animation should end now'); // Add this line
        setIsConfigureFlashing(false);
      }, 1000);
    }
  };

  const handleResetTransactions = async (selectedAccountIds: number[]) => {
    setLoadingStates((prev) => ({ ...prev, transactions: true }));

    try {
      const response = await fetch('/api/reset/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountIds: selectedAccountIds }),
      });

      if (!response.ok) throw new Error('Reset failed');

      toast({
        title: 'Reset Successful',
        description: `Successfully reset ${selectedAccountIds.length} account${
          selectedAccountIds.length === 1 ? '' : 's'
        }.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Reset failed:', error);
      toast({
        title: 'Reset Failed',
        description: 'Failed to reset selected accounts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, transactions: false }));
      setIsResetTransactionsOpen(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b pb-6">
        <Settings2 className="h-8 w-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Global App Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Access Control Section */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Access Control</h2>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div>
              <Label htmlFor="role-enforcement" className="text-lg font-medium">
                Enforce Parent/Child Roles
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                This is for those people who do not want to &quot;mess&quot; with toggling between
                Parent mode and verifying they are a Parent.
              </p>
            </div>
            <Switch
              id="role-enforcement"
              checked={enforceRoles}
              onCheckedChange={handleRoleEnforcementChange}
              aria-label="Toggle role enforcement"
            />
          </div>

          {/* Only show PIN section when role enforcement is enabled */}
          {enforceRoles && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Global PIN</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={pin || ''}
                    placeholder={pin ? 'Enter 4-digit PIN' : 'Not set'}
                    className="w-32 pr-8"
                    readOnly
                    onClick={handlePinFieldClick}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {!pin ? (
                  <PinSetupDialog
                    onSetPin={setPin}
                    className={isConfigureFlashing ? 'animate-pulse scale-105 bg-blue-50' : ''}
                  />
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleTestPin}>
                      Test PIN
                    </Button>
                    <PinSetupDialog
                      onSetPin={setPin}
                      existingPin={pin}
                      buttonText="Change PIN"
                      dialogTitle="Change Global PIN"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearPin}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove PIN
                    </Button>
                  </>
                )}
              </div>
              {!pin && (
                <div className="mt-2 max-w-lg">
                  <p className="text-sm text-gray-500">
                    No PIN configured. Without a PIN, any user can enter this settings page. A PIN
                    is not required, but helps to keep children from accidentally wandering into the
                    settings. If you forget the PIN, you may be locked out and need to reinstall the
                    application.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Default Currency Section */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Coins className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Default Currency</h2>
          </div>
          <Select
            onValueChange={handleCurrencyChange}
            value={selectedCurrency}
            disabled={loadingCurrency}
            aria-label="Select default currency"
          >
            <SelectTrigger
              className={`w-48 ${selectedCurrency ? 'border-blue-500 text-blue-700' : ''}`}
            >
              <SelectValue placeholder={loadingCurrency ? 'Loading...' : 'Select Currency'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CHF">CHF</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Two Column Layout for Backup and Reset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backup and Restore Section */}
          <section className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Save className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-semibold">Backup and Restore</h2>
            </div>

            {/* Tasks Backup/Restore */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Tasks</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBackup('tasks')}
                    disabled={loadingBackup.tasks}
                    className="flex-1 transition-all hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {loadingBackup.tasks ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore('tasks')}
                    disabled={loadingRestore.tasks}
                    className="flex-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  >
                    {loadingRestore.tasks ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Restore
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download or restore all task definitions.
                </p>
              </div>

              {/* Users Backup/Restore */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Users</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBackup('users')}
                    disabled={loadingBackup.users}
                    className="flex-1 transition-all hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {loadingBackup.users ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore('users')}
                    disabled={loadingRestore.users}
                    className="flex-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  >
                    {loadingRestore.users ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Restore
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download or restore all user profiles and their settings.
                </p>
              </div>

              {/* Accounts Backup/Restore */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Accounts</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBackup('piggybank')}
                    disabled={loadingBackup.piggybank}
                    className="flex-1 transition-all hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {loadingBackup.piggybank ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore('piggybank')}
                    disabled={loadingRestore.piggybank}
                    className="flex-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  >
                    {loadingRestore.piggybank ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Restore
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download or restore all account balances and transaction history.
                </p>
              </div>

              {/* Entire Database Backup/Restore */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Entire Database</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBackup('all')}
                    disabled={loadingBackup.all}
                    className="flex-1 transition-all hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    {loadingBackup.all ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore('all')}
                    disabled={loadingRestore.all}
                    className="flex-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  >
                    {loadingRestore.all ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Restore
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download or restore all data from the entire database.
                </p>
              </div>
            </div>
          </section>

          {/* Reset Section */}
          <section className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <RotateCcw className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-semibold">Reset Options</h2>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 text-sm text-yellow-700">
                  Warning: These actions cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  onClick={() => handleResetClick('tasks')}
                  disabled={loadingStates.tasks}
                >
                  {loadingStates.tasks && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete All Tasks
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Will delete{' '}
                  <Link href="/task-management" className="text-blue-600 hover:underline">
                    all tasks
                  </Link>{' '}
                  and their completion history. Existing transactions will remain unchanged. Not
                  reversible. You will need to create new tasks.
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  onClick={() => handleResetClick('users')}
                  disabled={loadingStates.users}
                >
                  {loadingStates.users && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete All Users
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Will delete{' '}
                  <Link href="/user-management" className="text-blue-600 hover:underline">
                    all users
                  </Link>{' '}
                  and all their associated data (Sparkässeli accounts, completed tasks, transaction
                  history). Not reversible.
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  onClick={() => handleResetClick('transactions')}
                  disabled={loadingStates.transactions}
                >
                  {loadingStates.transactions && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Transaction History and Balances
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Will delete all transaction history from{' '}
                  <Link href="/piggy-bank" className="text-blue-600 hover:underline">
                    one or more Sparkässeli accounts
                  </Link>{' '}
                  and reset their balances to zero. Not reversible.
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  onClick={() => handleResetClick('all')}
                  disabled={loadingStates.all}
                >
                  {loadingStates.all && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Entire Database
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Will delete all data from the database. This includes all users, tasks, accounts,
                  and their related data. Not reversible.
                </p>
              </div>
            </div>
          </section>
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

      {/* Add the disable roles confirmation dialog */}
      <ConfirmDialog
        isOpen={disableRolesDialog}
        onClose={() => setDisableRolesDialog(false)}
        onConfirm={() => {
          setEnforceRoles(false);
          setDisableRolesDialog(false);
        }}
        title="Disable Role Enforcement?"
        description="This will clear the current PIN and disable role-based access control. This means that children will be able to access this settings page and all parts of the application. Are you sure?"
        confirmText="Yes, Disable"
        cancelText="Cancel"
      />

      {/* Add PIN Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isPinClearDialogOpen}
        onClose={() => setIsPinClearDialogOpen(false)}
        onConfirm={confirmClearPin}
        title="Remove Global PIN?"
        description="This will remove the PIN protection from the global settings. Anyone will be able to access the settings page when role enforcement is enabled. Are you sure you want to continue?"
        confirmText="Yes, Remove PIN"
        cancelText="Cancel"
      />

      {/* Add ResetTransactionsDialog */}
      <ResetTransactionsDialog
        isOpen={isResetTransactionsOpen}
        onClose={() => setIsResetTransactionsOpen(false)}
        onConfirm={handleResetTransactions}
        isLoading={loadingStates.transactions}
      />
    </div>
  );
}
