'use client';

import { useState, useEffect } from 'react';

export function useCurrency() {
  const [currency, setCurrency] = useState<string | null>(null);
  const [format, setFormat] = useState<string>('symbol');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [currencyResponse, formatResponse] = await Promise.all([
          fetch('/api/settings/currency'),
          fetch('/api/settings/currency-format'),
        ]);

        if (currencyResponse.ok) {
          const { currency } = await currencyResponse.json();
          setCurrency(currency);
        }

        if (formatResponse.ok) {
          const { format } = await formatResponse.json();
          setFormat(format || 'symbol'); // Default to symbol if not set
        }
      } catch (error) {
        console.error('Failed to fetch currency settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { currency, format, isLoading };
}
