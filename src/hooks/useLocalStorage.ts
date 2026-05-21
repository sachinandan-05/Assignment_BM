import { useState, useCallback } from 'react';

/**
 * useLocalStorage – Type-safe persistent state manager.
 *
 * Syncs React state with the browser's localStorage API.
 * Supports functional updates (same API as useState).
 *
 * @param key - The localStorage key to read/write.
 * @param initialValue - Fallback value when key doesn't exist.
 * @returns A stateful value and a setter function.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
 * setTheme('light');
 * setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
