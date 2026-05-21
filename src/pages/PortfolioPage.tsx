import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import { AsyncBoundary } from '@/components/ui/AsyncBoundary';
import { HoldingCard } from '@/components/finance/HoldingCard';
import { HoldingsTable } from '@/components/finance/HoldingsTable';
import { SEO } from '@/components/finance/SEO';
import { useHoldings, usePortfolio } from '@/hooks/useFinance';
import { formatCurrency, formatPercentage } from '@/utils';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

// ─────────────────────────────────────────────────
// PORTFOLIO PAGE – Holdings grid + table view
// ─────────────────────────────────────────────────

export default function PortfolioPage() {
  const { data: holdings, isLoading: holdingsLoading, error: holdingsError, refetch: refetchHoldings } = useHoldings();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();

  return (
    <>
      <SEO
        title="Portfolio"
        description="View and manage your complete portfolio holdings, sector allocation, and historical performance."
      />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Portfolio</h1>
            <p className="text-sm text-text-faint mt-1">
              Manage your asset positions and track performance.
            </p>
          </div>
          <Button variant="premium" size="md">
            <TrendingUp className="h-4 w-4" />
            New Trade
          </Button>
        </div>

        {/* Portfolio summary cards */}
        {portfolioLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : portfolio ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="md" hover>
              <div className="text-xs text-text-faint uppercase tracking-wider mb-1">Total Value</div>
              <div className="text-xl font-bold text-text-primary font-mono">
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-success text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {formatPercentage(portfolio.dayChangePercent)} today
              </div>
            </Card>
            <Card padding="md" hover>
              <div className="text-xs text-text-faint uppercase tracking-wider mb-1">Total Return</div>
              <div className="text-xl font-bold text-success font-mono">
                {formatCurrency(portfolio.totalGain)}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {formatPercentage(portfolio.totalGainPercent)} all time
              </div>
            </Card>
            <Card padding="md" hover>
              <div className="text-xs text-text-faint uppercase tracking-wider mb-1">Cash Balance</div>
              <div className="text-xl font-bold text-text-primary font-mono">
                {formatCurrency(portfolio.cashBalance)}
              </div>
              <div className="text-xs text-text-muted mt-1">Available for trading</div>
            </Card>
          </div>
        ) : null}

        {/* Holdings cards grid */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Positions</h2>
          <AsyncBoundary
            data={holdings ?? null}
            loading={holdingsLoading}
            error={holdingsError}
            onRetry={() => void refetchHoldings()}
            loadingFallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <StatCardSkeleton key={i} />
                ))}
              </div>
            }
            emptyTitle="No positions yet"
            emptyMessage="Open your first position to see holdings here."
          >
            {(items) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {items.map((h, i) => (
                  <HoldingCard key={h.id} holding={h} index={i} />
                ))}
              </div>
            )}
          </AsyncBoundary>
        </div>

        {/* Holdings table */}
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="px-5 pt-5">
            <CardTitle>All Holdings</CardTitle>
            <span className="text-xs text-text-faint">{holdings?.length ?? 0} positions</span>
          </CardHeader>
          <CardContent>
            <AsyncBoundary
              data={holdings ?? null}
              loading={holdingsLoading}
              error={holdingsError}
              onRetry={() => void refetchHoldings()}
              loadingFallback={<ChartSkeleton height={200} />}
              emptyTitle="No holdings to display"
              emptyMessage="Your holdings will appear here once you have an open position."
            >
              {(items) => <HoldingsTable holdings={items} />}
            </AsyncBoundary>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
