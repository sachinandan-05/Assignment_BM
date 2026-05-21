import { AlertTriangle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

// ═══════════════════════════════════════════════════════
// ASYNC BOUNDARY — Renders the right surface for the four
// states of any data-driven view: loading, error, empty,
// success. Wraps a React Query (or useFetch) result.
// ═══════════════════════════════════════════════════════

export interface AsyncBoundaryProps<T> {
  /** Data returned by the source query/hook. */
  data: T | null | undefined;
  /** True while the request is in flight. */
  loading: boolean;
  /** Non-null when the request rejected. */
  error: unknown;
  /** Optional retry handler shown alongside the error UI. */
  onRetry?: () => void;
  /** Skeleton/loader markup to render while `loading`. */
  loadingFallback?: React.ReactNode;
  /** Predicate that returns true when `data` is empty (default: `[]` or null). */
  isEmpty?: (data: T) => boolean;
  /** Markup rendered for the empty state. Falls back to a built-in message. */
  emptyFallback?: React.ReactNode;
  /** Heading shown above the built-in empty state. */
  emptyTitle?: string;
  /** Body shown above the built-in empty state. */
  emptyMessage?: string;
  /** Render-prop invoked once data is non-empty. */
  children: (data: T) => React.ReactNode;
  /** Outer container className. */
  className?: string;
}

const defaultIsEmpty = <T,>(d: T): boolean => {
  if (Array.isArray(d)) return d.length === 0;
  return d == null;
};

export function AsyncBoundary<T>({
  data,
  loading,
  error,
  onRetry,
  loadingFallback,
  isEmpty = defaultIsEmpty,
  emptyFallback,
  emptyTitle = 'Nothing to show yet',
  emptyMessage = 'Data will appear here as soon as it becomes available.',
  children,
  className,
}: AsyncBoundaryProps<T>) {
  if (loading) {
    return (
      <div className={cn('w-full', className)} role="status" aria-live="polite">
        {loadingFallback ?? (
          <div className="h-32 w-full rounded-xl bg-surface-low animate-pulse" aria-label="Loading" />
        )}
      </div>
    );
  }

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Something went wrong while loading this section.';
    return (
      <div
        role="alert"
        className={cn(
          'rounded-xl border border-alert/20 bg-alert/5 p-5 flex items-start gap-3',
          className,
        )}
      >
        <div className="p-2 rounded-lg bg-alert/10 text-alert">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <h4 className="text-body-md font-semibold text-text-primary">
            We couldn&apos;t load this section
          </h4>
          <p className="text-label-sm text-text-muted">{message}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry} aria-label="Retry loading">
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (data == null || isEmpty(data)) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return (
      <div
        className={cn(
          'rounded-xl border border-edge-subtle bg-surface-low p-8 text-center',
          className,
        )}
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-mid text-text-faint mb-3">
          <Inbox className="h-5 w-5" aria-hidden="true" />
        </div>
        <h4 className="text-body-md font-semibold text-text-primary">{emptyTitle}</h4>
        <p className="text-label-sm text-text-muted mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children(data)}</>;
}
