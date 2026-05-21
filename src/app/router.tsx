import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { StatCardSkeleton } from '@/components/ui/Skeleton';

// ─── LAZY PAGES ────────────────────────────────────────
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const BudgetsPage = lazy(() => import('@/pages/BudgetsPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ─── LOADING FALLBACK ──────────────────────────────────
const PageLoader = () => (
  <div className="space-y-8 animate-pulse p-8" role="status" aria-label="Loading page">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <div className="h-[400px] w-full bg-surface-low rounded-3xl border border-edge-subtle" />
    <span className="sr-only">Loading…</span>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'portfolio', element: <PortfolioPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'budgets', element: <BudgetsPage /> },
          { path: 'insights', element: <InsightsPage /> },
          { path: 'watchlist', element: <WatchlistPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
