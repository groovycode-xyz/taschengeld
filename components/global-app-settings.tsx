"use client"

import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function GlobalAppSettings() {
  const [enforceRoles, setEnforceRoles] = useState(false);
  const [globalPin, setGlobalPin] = useState('');

  const handleResetUsers = () => {
    // Implement reset users logic
    console.log('Resetting users...');
  };

  const handleResetTasks = () => {
    // Implement reset tasks logic
    console.log('Resetting tasks...');
  };

  const handleResetPiggyBanks = () => {
    // Implement reset piggy banks logic
    console.log('Resetting piggy banks...');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Global App Settings</h2>
      
      <div className="mb-4">
        <label className="flex items-center">
          <span className="mr-2">Enforce Parent/Children role distinctions:</span>
          <Switch
            checked={enforceRoles}
            onCheckedChange={setEnforceRoles}
          />
        </label>
        <p className="text-sm text-gray-500 mt-1">
          This is for those people who do not want to &quot;mess&quot; with toggling between Parent mode and verifying they are a Parent.
        </p>
      </div>

      {enforceRoles && (
        <div className="mb-4">
          <label className="block mb-2">Global PIN:</label>
          <Input
            type="password"
            value={globalPin}
            onChange={(e) => setGlobalPin(e.target.value)}
            maxLength={4}
            placeholder="Enter 4-digit PIN"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use this PIN to enter Global Settings. This PIN may also be used anytime user is required to verify they are a Parent when using the Parent toggle switch within the application.
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Reset Settings</h3>
        <p className="text-sm text-red-500 mb-2">
          Warning: These options will have irreversible consequences. Do not use unless you are aware that you will need to recreate any data that is deleted by taking these actions.
        </p>
        <div className="space-y-2">
          <Button onClick={handleResetUsers} variant="destructive">Reset and erase all Users</Button>
          <Button onClick={handleResetTasks} variant="destructive">Reset and erase all Tasks</Button>
          <Button onClick={handleResetPiggyBanks} variant="destructive">Reset and erase all Piggy Bank Account Balances</Button>
        </div>
      </div>
    </div>
  );
}