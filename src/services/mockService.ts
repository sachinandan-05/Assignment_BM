import {
  mockAIInsights,
  mockAlerts,
  mockAllocation,
  mockBudgetAnalytics,
  mockHoldings,
  mockMarketIndices,
  mockMarketSentiment,
  mockNotifications,
  mockPerformanceData,
  mockPortfolio,
  mockStatCards,
  mockTransactions,
  mockWatchlist,
} from '@/data/mock';
import type {
  AIInsight,
  AllocationSlice,
  AppAlert,
  BudgetAnalytics,
  Holding,
  MarketIndex,
  MarketSentiment,
  Notification,
  PerformanceDataPoint,
  PortfolioSummary,
  StatCard,
  Transaction,
  WatchlistItem,
} from '@/types';

// ═══════════════════════════════════════════════════════
// MOCK SERVICE — single integration boundary for the app.
// Resolves typed entities after a randomized latency to
// mimic real network behavior.
// ═══════════════════════════════════════════════════════

const MIN_LATENCY = 200;
const MAX_LATENCY = 800;

const randomLatency = () => MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), randomLatency()));

export interface TransactionsPage {
  data: Transaction[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const mockService = {
  getPortfolio: (): Promise<PortfolioSummary> => delay(mockPortfolio),

  getHoldings: (): Promise<Holding[]> => delay([...mockHoldings]),

  getAllocation: (): Promise<AllocationSlice[]> => delay([...mockAllocation]),

  getTransactions: (page = 1, pageSize = 20): Promise<TransactionsPage> => {
    const start = (page - 1) * pageSize;
    const data = mockTransactions.slice(start, start + pageSize);
    return delay({
      data: [...data],
      pagination: {
        page,
        pageSize,
        total: mockTransactions.length,
        totalPages: Math.ceil(mockTransactions.length / pageSize),
      },
    });
  },

  getAllTransactions: (): Promise<Transaction[]> => delay([...mockTransactions]),

  getBudgets: (): Promise<BudgetAnalytics> => delay(mockBudgetAnalytics),

  getAIInsights: (): Promise<AIInsight[]> => delay([...mockAIInsights]),

  getMarketSentiment: (): Promise<MarketSentiment> => delay(mockMarketSentiment),

  getAlerts: (): Promise<AppAlert[]> => delay([...mockAlerts]),

  getWatchlist: (): Promise<WatchlistItem[]> => delay([...mockWatchlist]),

  getMarketIndices: (): Promise<MarketIndex[]> => delay([...mockMarketIndices]),

  getPerformance: (): Promise<PerformanceDataPoint[]> => delay([...mockPerformanceData]),

  getStatCards: (): Promise<StatCard[]> => delay([...mockStatCards]),

  getNotifications: (): Promise<Notification[]> => delay([...mockNotifications]),
} as const;
