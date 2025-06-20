'use client';

import { useSettings } from '@/components/context/settings-context';

export function useCurrency() {
  const { settings, isLoading } = useSettings();

  return {
    currency: settings.default_currency,
    format: settings.currency_format,
    isLoading,
  };
}
