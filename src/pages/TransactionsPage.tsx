import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { AsyncBoundary } from '@/components/ui/AsyncBoundary';
import { TransactionsTable } from '@/components/finance/TransactionsTable';
import { SEO } from '@/components/finance/SEO';
import { useTransactions } from '@/hooks/useFinance';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppStore } from '@/store';
import { Filter, Download, X } from 'lucide-react';

// ─────────────────────────────────────────────────
// TRANSACTIONS PAGE – Full transaction history
// ─────────────────────────────────────────────────

export default function TransactionsPage() {
  const { data, isLoading, error, refetch } = useTransactions();
  const { trackEvent, EVENTS } = useAnalytics();
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const handleFilter = () =>
    trackEvent(EVENTS.FILTER_INTERACTION, { source: 'TransactionsPage', filter: 'all' });
  const handleExport = () =>
    trackEvent(EVENTS.EXPORT_CSV, { source: 'TransactionsPage', count: data?.pagination?.total ?? 0 });

  return (
    <>
      <SEO
        title="Transactions"
        description="Search, filter, and export the complete transaction history for your portfolio."
      />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Transactions</h1>
            <p className="text-sm text-text-faint mt-1">
              Complete history of all portfolio activity.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleFilter}>
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        <Card padding="none" className="overflow-hidden">
          <CardHeader className="px-5 pt-5">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/10 text-blue-400 text-[11px] font-medium hover:bg-blue-600/20 transition-colors"
                  aria-label="Clear search"
                >
                  Searching: &ldquo;{searchQuery}&rdquo;
                  <X className="h-3 w-3" />
                </button>
              )}
              <span className="text-xs text-text-faint">
                {data?.pagination?.total ?? 0} total transactions
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <AsyncBoundary
              data={data?.data ?? null}
              loading={isLoading}
              error={error}
              onRetry={() => void refetch()}
              loadingFallback={<ChartSkeleton height={300} />}
              emptyTitle="No transactions yet"
              emptyMessage="When you make your first transaction it will appear here."
            >
              {(rows) => <TransactionsTable transactions={rows} searchQuery={searchQuery} />}
            </AsyncBoundary>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
