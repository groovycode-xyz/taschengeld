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

export function GlobalAppSettings() {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAll = async () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setIsResetting(true);
      try {
        const response = await fetch('/api/reset-all', { method: 'POST' });
        if (response.ok) {
          alert('All data has been reset successfully.');
        } else {
          throw new Error('Failed to reset data');
        }
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('An error occurred while resetting data.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold mb-4">Global App Settings</h1>

      {/* PIN Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">PIN</h2>
        <Input type="password" maxLength={4} placeholder="Enter 4-digit PIN" className="w-32" />
      </div>

      {/* Default Currency Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Default Currency</h2>
        <Select>
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
        <h2 className="text-xl font-semibold mb-2">Reset Section</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Reset all users
          </Button>
          <Button variant="outline" className="w-full">
            Reset all tasks
          </Button>
          <Button variant="outline" className="w-full">
            Reset all transactions but keep accounts
          </Button>
          <Button variant="outline" className="w-full">
            Reset all transactions and accounts
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResetAll}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : 'Reset all'}
          </Button>
        </div>
      </div>
    </div>
  );
}
