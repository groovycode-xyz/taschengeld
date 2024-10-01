"use client"

import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Settings, Users, ClipboardList, PiggyBank } from 'lucide-react';

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Global App Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2" />
            Role Enforcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enforce Parent/Children role distinctions:</p>
              <p className="text-sm text-gray-500 mt-1">
                This is for those people who do not want to &quot;mess&quot; with toggling between Parent mode and verifying they are a Parent.
              </p>
            </div>
            <Switch
              checked={enforceRoles}
              onCheckedChange={setEnforceRoles}
            />
          </div>
          
          {enforceRoles && (
            <div className="mt-6">
              <label className="block mb-2 font-medium">Global PIN:</label>
              <Input
                type="password"
                value={globalPin}
                onChange={(e) => setGlobalPin(e.target.value)}
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                className="w-full max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-2">
                Use this PIN to enter Global Settings. This PIN may also be used anytime user is required to verify they are a Parent when using the Parent toggle switch within the application.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2" />
            Reset Settings
          </CardTitle>
          <CardDescription className="text-red-500">
            Warning: These options will have irreversible consequences. Do not use unless you are aware that you will need to recreate any data that is deleted by taking these actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Button onClick={handleResetUsers} variant="destructive" className="w-full flex items-center justify-center">
              <Users className="mr-2" />
              Reset and erase all Users
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Will delete all users. Not reversible. You will need to create new users. The default built-in Parent User will be recreated automatically just like a new installation of the app.
            </p>
          </div>
          <div>
            <Button onClick={handleResetTasks} variant="destructive" className="w-full flex items-center justify-center">
              <ClipboardList className="mr-2" />
              Reset and erase all Tasks
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Will delete all currently defined Tasks, as well as all Task completion history. Not reversible. You will need to create new Tasks.
            </p>
          </div>
          <div>
            <Button onClick={handleResetPiggyBanks} variant="destructive" className="w-full flex items-center justify-center">
              <PiggyBank className="mr-2" />
              Reset and erase all Piggy Bank Account Balances
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Will delete all Bank Accounts of all users. Will delete all transactions and history. Not reversible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}