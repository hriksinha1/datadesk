import React from 'react';

interface MoneyProps {
  amount: number;
  compact?: boolean;
  className?: string;
  showZeroAsDash?: boolean;
}

export const Money: React.FC<MoneyProps> = ({
  amount,
  compact = false,
  className = '',
  showZeroAsDash = false,
}) => {
  if (showZeroAsDash && amount === 0) {
    return <span className={`tabular-nums ${className}`}>—</span>;
  }

  const num = Number(amount) || 0;

  if (compact) {
    let formatted = '';
    if (Math.abs(num) >= 100000) {
      formatted = `₹${(num / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    } else if (Math.abs(num) >= 1000) {
      formatted = `₹${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    } else {
      formatted = `₹${num.toLocaleString('en-IN')}`;
    }
    return <span className={`tabular-nums ${className}`}>{formatted}</span>;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(num);

  return <span className={`tabular-nums ${className}`}>{formatted}</span>;
};

interface DateTextProps {
  date: string;
  format?: 'short' | 'medium' | 'full' | 'weekday-day';
  className?: string;
}

export const DateText: React.FC<DateTextProps> = ({
  date,
  format = 'medium',
  className = '',
}) => {
  if (!date) return <span className={className}>—</span>;

  // Split YYYY-MM-DD directly to prevent timezone shift
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) {
    return <span className={className}>{date}</span>;
  }

  const utcDate = new Date(Date.UTC(y, m - 1, d));

  let str = '';
  if (format === 'short') {
    str = utcDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  } else if (format === 'weekday-day') {
    str = utcDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  } else if (format === 'full') {
    str = utcDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  } else {
    str = utcDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }

  return <span className={`tabular-nums ${className}`}>{str}</span>;
};
