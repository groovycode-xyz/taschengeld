import { useEffect, useState } from 'react';

interface CurrencyDisplayProps {
  value: number;
  className?: string;
}

export function CurrencyDisplay({ value, className = '' }: CurrencyDisplayProps) {
  const [currency, setCurrency] = useState<string>('CHF');
  const [format, setFormat] = useState<'symbol' | 'code' | 'both'>('symbol');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load currency settings from the server
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const [currencyResponse, formatResponse] = await Promise.all([
          fetch('/api/settings/currency'),
          fetch('/api/settings/currency-format'),
        ]);

        if (currencyResponse.ok) {
          const { currency } = await currencyResponse.json();
          setCurrency(currency || 'CHF');
        }

        if (formatResponse.ok) {
          const { format } = await formatResponse.json();
          setFormat(format || 'symbol');
        }
      } catch (error) {
        console.error('Failed to load currency settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const formatCurrency = (value: number): string => {
    if (isLoading) {
      return `${value.toFixed(2)} CHF`;
    }

    try {
      const formatter = new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const formatted = formatter.format(value);

      switch (format) {
        case 'symbol':
          return formatted;
        case 'code':
          return `${value.toFixed(2)} ${currency}`;
        case 'both':
          return `${formatted} ${currency}`;
        default:
          return formatted;
      }
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  return (
    <span className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {formatCurrency(value)}
    </span>
  );
} 