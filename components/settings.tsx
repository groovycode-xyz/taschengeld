'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useMode } from '@/components/context/mode-context';
import { useToast } from '@/components/ui/use-toast';

export function Settings() {
  const { enforceRoles, setEnforceRoles } = useMode();
  const { addToast } = useToast(); // Fixed: use addToast instead of toast
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleEnforcementChange = async (checked: boolean) => {
    setIsLoading(true);
    try {
      setEnforceRoles(checked);

      addToast({
        title: 'Settings Updated',
        description: `Parent/Child role enforcement is now ${checked ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Global Settings</h1>

      <Card className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <Label htmlFor="role-enforcement" className="text-lg font-medium">
              Enforce Parent/Child Roles
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              When enabled, certain features will require parent mode access
            </p>
          </div>
          <Switch
            id="role-enforcement"
            checked={enforceRoles}
            onCheckedChange={handleRoleEnforcementChange}
            disabled={isLoading}
            aria-label="Toggle role enforcement"
          />
        </div>
      </Card>
    </div>
  );
}
