'use client';

import React, { useState } from 'react';
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

type ResetType = 'users' | 'tasks' | 'accounts';

interface ResetDialogState {
  isOpen: boolean;
  type: ResetType | null;
}

interface BackupData {
  timestamp: string;
  type: 'tasks' | 'users' | 'piggybank';
  data: unknown;
}

export function GlobalAppSettings() {
  const { enforceRoles, setEnforceRoles, pin, setPin } = useMode(); // Add setPin back
  const { addToast: toast } = useToast();
  const [loadingStates, setLoadingStates] = useState({
    users: false,
    tasks: false,
    accounts: false,
  });
  const [resetDialog, setResetDialog] = useState<ResetDialogState>({
    isOpen: false,
    type: null,
  });
  const [loadingBackup, setLoadingBackup] = useState({
    tasks: false,
    users: false,
    piggybank: false,
  });
  const [loadingRestore, setLoadingRestore] = useState({
    tasks: false,
    users: false,
    piggybank: false,
  });
  const [disableRolesDialog, setDisableRolesDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [showPin, setShowPin] = useState(false);

  // Remove all PIN-related state and effects

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
    setSelectedCurrency(value);
    toast({
      title: 'Currency Updated',
      description: `Default currency has been set to ${value}`,
      variant: 'default',
    });
  };

  const handleBackup = async (type: 'tasks' | 'users' | 'piggybank') => {
    setLoadingBackup((prev) => ({ ...prev, [type]: true }));

    try {
      // Simulate API call to get data
      const mockData: BackupData = {
        timestamp: new Date().toISOString(),
        type,
        data: {
          /* This will be replaced with real data */
        },
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
      saveAs(blob, `tascheged-${type}-backup-${new Date().toISOString()}.json`);

      toast({
        title: 'Backup Successful',
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } data has been backed up successfully.`,
        variant: 'default',
      });
    } catch (error: unknown) {
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

  const handleRestore = async (type: 'tasks' | 'users' | 'piggybank') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setLoadingRestore((prev) => ({ ...prev, [type]: true }));

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target?.result as string;
          const backupData: BackupData = JSON.parse(content);

          if (backupData.type !== type) {
            throw new Error('Invalid backup file type');
          }

          // Simulate restore delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          toast({
            title: 'Restore Successful',
            description: `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } data has been restored successfully.`,
            variant: 'default',
          });
        };

        reader.onerror = () => {
          throw new Error('Failed to read file');
        };

        reader.readAsText(file);
      } catch (error: unknown) {
        console.error('Restore failed:', error);
        toast({
          title: 'Restore Failed',
          description: `Failed to restore ${type} data. Please ensure you selected the correct backup file.`,
          variant: 'destructive',
        });
      } finally {
        setLoadingRestore((prev) => ({ ...prev, [type]: false }));
      }
    };

    input.click();
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex items-center space-x-3">
        <Settings2 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Global App Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Access Control Section */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex items-center gap-3 mb-4">
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

          {/* Update Global PIN section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Global PIN</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input
                  type={showPin ? 'text' : 'password'}
                  value={pin || ''}
                  placeholder="Enter 4-digit PIN"
                  className="w-32 pr-8"
                  readOnly
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
                <PinSetupDialog onSetPin={setPin} />
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    Test PIN
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPin(null)}>
                    ✕
                  </Button>
                </>
              )}
            </div>
            {!pin && (
              <div className="mt-2 max-w-lg">
                <p className="text-sm text-gray-500">
                  No PIN configured. Without a PIN, any user can enter this settings page. A PIN is
                  not required, but helps to keep children from accidentally wandering into the
                  settings. If you forget the PIN, you may be locked out and need to reinstall the
                  application.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Default Currency Section */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Default Currency</h2>
          </div>
          <Select onValueChange={handleCurrencyChange} aria-label="Select default currency">
            <SelectTrigger
              className={`w-48 ${selectedCurrency ? 'border-blue-500 text-blue-700' : ''}`}
            >
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
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Reset Options</h2>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                Warning: These options will have irreversible consequences. Do not use unless you
                are aware that you will need to recreate any data that is deleted by taking these
                actions.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Button
                variant="outline"
                className="w-full mb-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => handleResetClick('users')}
                disabled={loadingStates.users}
                aria-label="Reset and erase all users"
              >
                {loadingStates.users && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset and erase all Users
              </Button>
              <p className="text-sm text-muted-foreground">
                Will delete all users. Not reversible. You will need to create new users. The
                default built-in Parent User will be recreated automatically.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full mb-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => handleResetClick('tasks')}
                disabled={loadingStates.tasks}
                aria-label="Reset and erase all tasks"
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
                className="w-full mb-1 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => handleResetClick('accounts')}
                disabled={loadingStates.accounts}
                aria-label="Reset and erase all piggy bank accounts"
              >
                {loadingStates.accounts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset and erase all Piggy Bank Account Balances
              </Button>
              <p className="text-sm text-muted-foreground">
                Will delete all Bank Accounts of all users. Will delete all transactions and
                history. Not reversible.
              </p>
            </div>
          </div>
        </div>

        {/* Backup and Restore Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Save className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Backup and Restore</h2>
          </div>

          {/* Tasks Backup/Restore */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Tasks</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                onClick={() => handleBackup('tasks')}
                disabled={loadingBackup.tasks}
              >
                {loadingBackup.tasks ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download Tasks
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                onClick={() => handleRestore('tasks')}
                disabled={loadingRestore.tasks}
              >
                {loadingRestore.tasks ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Restore Tasks
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Download a JSON file containing all Tasks and their configurations
            </p>
          </div>

          {/* Users Backup/Restore */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Users</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                onClick={() => handleBackup('users')}
                disabled={loadingBackup.users}
              >
                {loadingBackup.users ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download Users
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                onClick={() => handleRestore('users')}
                disabled={loadingRestore.users}
              >
                {loadingRestore.users ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Restore Users
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Download a JSON file containing all Users and their configurations
            </p>
          </div>

          {/* Piggy Bank Backup/Restore */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Piggy Bank</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                onClick={() => handleBackup('piggybank')}
                disabled={loadingBackup.piggybank}
              >
                {loadingBackup.piggybank ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download Piggy Bank Data
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                onClick={() => handleRestore('piggybank')}
                disabled={loadingRestore.piggybank}
              >
                {loadingRestore.piggybank ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Restore Piggy Bank Data
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Download a JSON file containing all Piggy Bank accounts and their transaction history
            </p>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                Warning: Restoring data will overwrite any existing data. These actions cannot be
                undone.
              </p>
            </div>
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
    </div>
  );
}
