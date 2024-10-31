'use client';

import { useCurrency } from '@/hooks/useCurrency';

interface CurrencyDisplayProps {
  value: number;
  className?: string;
  symbolPosition?: 'before' | 'after';
  locale?: string;
  showZeroDecimals?: boolean;
}

const DEFAULT_PROPS = {
  symbolPosition: 'before' as const,
  locale: 'en-US',
  showZeroDecimals: true,
};

export function CurrencyDisplay({
  value,
  className = '',
  symbolPosition = DEFAULT_PROPS.symbolPosition,
  locale = DEFAULT_PROPS.locale,
  showZeroDecimals = DEFAULT_PROPS.showZeroDecimals,
}: CurrencyDisplayProps) {
  const { currency, format, isLoading } = useCurrency();

  // Handle loading state
  if (isLoading) {
    return <span className={className}>{value.toFixed(showZeroDecimals ? 2 : 0)}</span>;
  }

  // Handle no currency or 'none' selected
  if (!currency || currency === 'none') {
    return <span className={className}>{value.toFixed(showZeroDecimals ? 2 : 0)}</span>;
  }

  // Format the number based on saved format preference
  if (format === 'symbol') {
    return (
      <span className={className}>
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: showZeroDecimals ? 2 : 0,
        }).format(value)}
      </span>
    );
  }

  if (format === 'code') {
    const formattedValue = value.toFixed(showZeroDecimals ? 2 : 0);
    return (
      <span className={className}>
        {symbolPosition === 'before'
          ? `${currency} ${formattedValue}`
          : `${formattedValue} ${currency}`}
      </span>
    );
  }

  // format === 'both'
  const formattedWithSymbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showZeroDecimals ? 2 : 0,
  }).format(value);

  return (
    <span className={className}>
      {symbolPosition === 'before'
        ? `${formattedWithSymbol} ${currency}`
        : `${currency} ${formattedWithSymbol}`}
    </span>
  );
}
