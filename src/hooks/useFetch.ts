import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * State shape returned by useFetch.
 */
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Configuration options for useFetch.
 */
interface UseFetchOptions {
  /** Whether to execute immediately on mount (default: true). */
  autoRun?: boolean;
  /** Number of retry attempts on failure (default: 2). */
  retry?: number;
}

/**
 * useFetch – Generic async data fetcher with retry logic.
 *
 * A lightweight alternative to React Query for simple one-off fetches.
 * Provides built-in loading states, error handling, and exponential backoff retries.
 *
 * @param fetchFn - An async function that returns the data.
 * @param options - Configuration for auto-run and retry behavior.
 * @returns Object with data, loading, error, and a manual retry function.
 *
 * @example
 * const { data, loading, error, retry } = useFetch(
 *   () => fetch('/api/user').then(res => res.json()),
 *   { autoRun: true, retry: 3 }
 * );
 *
 * if (loading) return <Spinner />;
 * if (error) return <ErrorMessage onRetry={retry} />;
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = {},
) {
  const { autoRun = true, retry: maxRetries = 2 } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: autoRun,
    error: null,
  });

  const retryCount = useRef(0);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
      retryCount.current = 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');

      if (retryCount.current < maxRetries) {
        retryCount.current++;
        // Exponential backoff: 1s, 2s, 3s...
        setTimeout(execute, 1000 * retryCount.current);
      } else {
        setState({ data: null, loading: false, error });
        retryCount.current = 0;
      }
    }
  }, [fetchFn, maxRetries]);

  useEffect(() => {
    if (autoRun) {
      execute();
    }
  }, [execute, autoRun]);

  return { ...state, retry: execute };
}
