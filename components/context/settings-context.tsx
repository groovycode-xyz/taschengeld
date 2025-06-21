'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logger } from '@/app/lib/logger';

interface Settings {
  enforce_roles: boolean;
  parent_mode_pin: string | null;
  show_german_terms: boolean;
  default_currency: string | null;
  currency_format: string;
}

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateSetting: (key: keyof Settings, value: string | boolean | null) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  enforce_roles: false,
  parent_mode_pin: null,
  show_german_terms: true,
  default_currency: null,
  currency_format: 'symbol',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings({
        enforce_roles: data.enforce_roles === 'true',
        parent_mode_pin: data.parent_mode_pin || null,
        show_german_terms: data.show_german_terms === undefined ? true : data.show_german_terms === 'true',
        default_currency: data.default_currency || null,
        currency_format: data.currency_format || 'symbol',
      });
    } catch (err) {
      logger.error('Failed to fetch settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: keyof Settings, value: string | boolean | null) => {
    try {
      logger.debug(`Updating setting ${key} to ${value}`);

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: key,
          setting_value: value === null ? null : String(value),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error(`API error updating setting ${key}:`, errorData);
        throw new Error(errorData.error || 'Failed to update setting');
      }

      // Update local state to match how we parse from server
      const updatedValue =
        key === 'enforce_roles' || key === 'show_german_terms'
          ? value === true || value === 'true'
          : value;

      logger.debug(`Setting ${key} updated successfully, new value:`, updatedValue);
      setSettings((prev) => ({ ...prev, [key]: updatedValue }));
    } catch (err) {
      logger.error(`Failed to update setting ${key}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    isLoading,
    updateSetting,
    refreshSettings: fetchSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
