import { motion } from 'framer-motion';
import { SEO } from '@/components/finance/SEO';
import { VARIANTS, TRANSITIONS } from '@/constants';
import { cn } from '@/utils';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAlerts, useAIInsights, usePortfolio, useBudgets } from '@/hooks/useFinance';
import { FinancialStatCard } from '@/components/finance/FinancialStatCard';
import { AlertCard } from '@/components/finance/AlertCard';
import { AIStrategyHero, EditorNoteCard } from '@/components/finance/SpecializedCards';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import { Download, Filter, ArrowUpRight, ShoppingCart, Coffee, Home, Zap } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '@/utils';
import { useMemo } from 'react';
import type { AppAlert } from '@/types';

// ─── Severity ranking for alert sort order ──────────────
const severityRank: Record<AppAlert['type'], number> = {
  danger: 4,
  warning: 3,
  info: 2,
  success: 1,
};

// Mock data for spending composition
const spendingComposition = [
  { label: 'Housing & Utilities', value: 3200, max: 4000, variant: 'blue' as const },
  { label: 'Food & Dining', value: 850, max: 1200, variant: 'gold' as const },
  { label: 'Transportation', value: 450, max: 600, variant: 'success' as const },
  { label: 'Entertainment', value: 320, max: 500, variant: 'gradient' as const },
];

// Mock transactions for the table
const recentTransactions = [
  { id: '1', merchant: 'Amazon', category: 'Shopping', status: 'completed', amount: -124.5, date: '2024-12-18', icon: ShoppingCart },
  { id: '2', merchant: 'Starbucks', category: 'Food', status: 'completed', amount: -12.4, date: '2024-12-18', icon: Coffee },
  { id: '3', merchant: 'Apple Dividend', category: 'Income', status: 'completed', amount: 450.0, date: '2024-12-17', icon: Zap },
  { id: '4', merchant: 'Mortgage Payment', category: 'Housing', status: 'pending', amount: -2800.0, date: '2024-12-16', icon: Home },
];

const transactionColumns = [
  {
    key: 'merchant',
    label: 'Merchant',
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-surface-low border border-edge-subtle">
          <row.icon className="h-4 w-4 text-text-muted" />
        </div>
        <div>
          <div className="text-body-md font-semibold text-text-primary">{row.merchant}</div>
          <div className="text-[10px] text-text-faint uppercase font-bold tracking-wider">{row.date}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    render: (row: any) => <Badge variant="neutral">{row.category}</Badge>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: any) => (
      <Badge variant={row.status === 'completed' ? 'success' : 'warning'} dot>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right' as const,
    render: (row: any) => (
      <div className={cn('text-body-md font-mono font-bold', row.amount > 0 ? 'text-success' : 'text-text-primary')}>
        {row.amount > 0 ? '+' : ''}{formatCurrency(row.amount)}
      </div>
    ),
  },
];

export default function DashboardPage() {
  const { trackEvent, EVENTS } = useAnalytics();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: budgets } = useBudgets();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: aiInsights } = useAIInsights();

  // Sort alerts by severity (danger > warning > info > success), then timestamp desc.
  const sortedAlerts = useMemo(() => {
    if (!alerts) return [];
    return [...alerts]
      .filter((a) => !a.read)
      .sort((a, b) => {
        const dr = severityRank[b.type] - severityRank[a.type];
        if (dr !== 0) return dr;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      })
      .slice(0, 4);
  }, [alerts]);

  const handleFilterClick = () =>
    trackEvent(EVENTS.FILTER_INTERACTION, { source: 'DashboardPage', filter: 'transactions' });
  const handleExport = () =>
    trackEvent(EVENTS.EXPORT_CSV, { source: 'DashboardPage', target: 'recent-activity' });
  const handleViewBreakdown = () =>
    trackEvent(EVENTS.AI_INSIGHT_CLICK, { source: 'SpendingComposition', label: 'View Full Breakdown' });

  // Derive dynamic summary values; fall back to design copy until data resolves.
  const monthlySpend = budgets?.totalSpent ?? 0;
  const totalSavings = portfolio ? portfolio.totalValue - portfolio.investedValue : 0;

  return (
    <>
      <SEO 
        title="Institutional Wealth Dashboard" 
        description="Real-time portfolio intelligence and AI strategy engine for private client wealth curation."
      />

      <motion.div
        variants={TRANSITIONS.stagger}
        initial="initial"
        animate="animate"
        className="space-y-10"
      >
        {/* 1. Summary Cards */}
        <motion.div variants={VARIANTS.fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <FinancialStatCard
                label="Total Net Worth"
                value={portfolio ? formatCompactCurrency(portfolio.totalValue) : '—'}
                changePercent={portfolio?.dayChangePercent ?? 0}
                trend={(portfolio?.dayChangePercent ?? 0) >= 0 ? 'up' : 'down'}
                icon="Wallet"
                accent="blue"
              />
              <FinancialStatCard
                label="Monthly Spending"
                value={budgets ? formatCurrency(monthlySpend) : '$4,822'}
                changePercent={-12.4}
                trend="down"
                icon="BarChart3"
                accent="gold"
              />
              <FinancialStatCard
                label="Total Savings"
                value={portfolio ? formatCompactCurrency(totalSavings) : '$1,248,850'}
                changePercent={portfolio?.totalGainPercent ?? 0}
                trend={(portfolio?.totalGainPercent ?? 0) >= 0 ? 'up' : 'down'}
                icon="PiggyBank"
                accent="success"
              />
            </>
          )}
        </motion.div>

        {/* 2. AI Strategy Hero */}
        <AIStrategyHero />

        {/* 3. Bento Grid: Alerts & Spending */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left: Alerts & Note */}
          <div className="xl:col-span-4 space-y-6">
            <h3 className="text-headline-sm text-text-primary flex items-center gap-2">
              Active Alerts
              <Badge variant="danger" size="sm">
                {sortedAlerts.length}
              </Badge>
            </h3>

            <div className="space-y-4">
              {alertsLoading ? (
                <>
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </>
              ) : sortedAlerts.length > 0 ? (
                sortedAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    variant={alert.type}
                    title={alert.title}
                    message={alert.message}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-edge-subtle bg-surface-low p-6 text-center">
                  <p className="text-body-md text-text-secondary">All clear</p>
                  <p className="text-label-sm text-text-faint mt-1">
                    No active alerts. We&apos;ll notify you when something changes.
                  </p>
                </div>
              )}
            </div>

            {aiInsights && aiInsights.length > 0 && (
              <div className="rounded-2xl border border-edge-subtle bg-surface-low p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    AI Signal
                  </span>
                  <Badge variant="default" size="sm">
                    {aiInsights[0]!.confidence}% confidence
                  </Badge>
                </div>
                <h4 className="text-body-md font-semibold text-text-primary">
                  {aiInsights[0]!.title}
                </h4>
                <p className="text-label-sm text-text-muted leading-relaxed">
                  {aiInsights[0]!.insight}
                </p>
              </div>
            )}

            <EditorNoteCard />
          </div>

          {/* Right: Spending Composition */}
          <div className="xl:col-span-8 bento-card rounded-3xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-headline-sm text-text-primary tracking-tight">Spending Composition</h3>
                <p className="text-label-sm text-text-muted mt-1">Analytics based on last 30 days</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleViewBreakdown}>
                View Full Breakdown
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {spendingComposition.map((item) => (
                <ProgressBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={item.max}
                  variant={item.variant}
                  showValue
                  size="lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. Recent Activity Table */}
        <div className="bento-card rounded-3xl overflow-hidden border-edge-subtle">
          <div className="px-8 py-6 border-b border-edge-subtle flex items-center justify-between">
            <div>
              <h3 className="text-headline-sm text-text-primary tracking-tight">Recent Activity</h3>
              <p className="text-label-sm text-text-muted mt-1">Showing transactions from all accounts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleFilterClick}>
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filters
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={transactionColumns}
            data={recentTransactions}
            rowKey={(r) => r.id}
            className="px-3"
          />
        </div>
      </motion.div>
    </>
  );
}
