import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ═══════════════════════════════════════════════════════
// UI Utilities
// ═══════════════════════════════════════════════════════

/**
 * Merges Tailwind classes and resolves conflicts using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ═══════════════════════════════════════════════════════
// Formatters
// ═══════════════════════════════════════════════════════

/**
 * Formats a number as USD currency.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number as a compact currency (e.g., $1.2M).
 */
export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a number as a percentage.
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export const formatPercentage = formatPercent;

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(new Date(date));
}

/**
 * Formats a date as a relative time string (e.g., "2h ago", "3d ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diffMs = now - target;
  const diffMin = Math.round(diffMs / 60_000);
  const diffHr = Math.round(diffMs / 3_600_000);
  const diffDay = Math.round(diffMs / 86_400_000);

  if (Number.isNaN(target)) return '';
  if (diffMs < 60_000) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
}

// ═══════════════════════════════════════════════════════
// Math Utilities
// ═══════════════════════════════════════════════════════

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
