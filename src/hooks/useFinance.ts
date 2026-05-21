import { useQuery } from '@tanstack/react-query';
import { mockService } from '@/services/mockService';
import { generateAIInsights } from '@/utils/insightEngine';
import { QUERY_KEYS } from '@/constants';
import type { AIInsight, Transaction } from '@/types';

// ═══════════════════════════════════════════════════════
// DOMAIN HOOKS — Finance, portfolio, market, intelligence.
//
// Each hook wraps React Query around a typed mockService
// method with appropriate cache and refetch policies.
// ═══════════════════════════════════════════════════════

// ─── Portfolio & Holdings ───────────────────────────────

export function usePortfolio() {
  return useQuery({
    queryKey: QUERY_KEYS.portfolio,
    queryFn: mockService.getPortfolio,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useHoldings() {
  return useQuery({
    queryKey: QUERY_KEYS.holdings,
    queryFn: mockService.getHoldings,
    staleTime: 30_000,
  });
}

export function useAllocation() {
  return useQuery({
    queryKey: QUERY_KEYS.allocation,
    queryFn: mockService.getAllocation,
    staleTime: 300_000,
  });
}

// ─── Transactions ───────────────────────────────────────

export function useTransactions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...QUERY_KEYS.transactions, page, pageSize],
    queryFn: () => mockService.getTransactions(page, pageSize),
    staleTime: 60_000,
  });
}

// ─── Budgets ────────────────────────────────────────────

export function useBudgets() {
  return useQuery({
    queryKey: QUERY_KEYS.budgets,
    queryFn: mockService.getBudgets,
    staleTime: 30_000,
  });
}

// ─── AI Insights ────────────────────────────────────────

export function useAIInsights() {
  const { data: holdings } = useHoldings();
  const { data: budgets } = useBudgets();

  return useQuery<AIInsight[]>({
    queryKey: [...QUERY_KEYS.insights, holdings?.length, budgets?.totalSpent],
    queryFn: async () => {
      const baseline = await mockService.getAIInsights();
      if (holdings && budgets) {
        const dynamic = generateAIInsights([] as Transaction[], holdings, budgets);
        return [...baseline, ...dynamic];
      }
      return baseline;
    },
    enabled: Boolean(holdings && budgets),
  });
}

// ─── Market & Alerts ────────────────────────────────────

export function useMarketSentiment() {
  return useQuery({
    queryKey: QUERY_KEYS.sentiment,
    queryFn: mockService.getMarketSentiment,
    staleTime: 30_000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.alerts,
    queryFn: mockService.getAlerts,
    staleTime: 60_000,
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: QUERY_KEYS.watchlist,
    queryFn: mockService.getWatchlist,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useMarketIndices() {
  return useQuery({
    queryKey: QUERY_KEYS.marketIndices,
    queryFn: mockService.getMarketIndices,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function usePerformance() {
  return useQuery({
    queryKey: QUERY_KEYS.performance,
    queryFn: mockService.getPerformance,
    staleTime: 300_000,
  });
}

export function useStatCards() {
  return useQuery({
    queryKey: QUERY_KEYS.statCards,
    queryFn: mockService.getStatCards,
    staleTime: 30_000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: mockService.getNotifications,
    staleTime: 60_000,
  });
}
