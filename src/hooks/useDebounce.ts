import { useState, useEffect } from 'react';

/**
 * useDebounce – Delays rapidly changing values.
 *
 * Useful for search inputs, filter fields, or any value that
 * triggers expensive operations (API calls, re-renders).
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 300ms).
 * @returns The debounced value (updates only after the delay).
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 400);
 *
 * useEffect(() => {
 *   // Only fires 400ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
