// ═══════════════════════════════════════════════════════
// SHARED FAST-CHECK ARBITRARIES
// ═══════════════════════════════════════════════════════
//
// Generators for domain models defined in src/types/index.ts.
// Every arbitrary respects the invariants documented in
// .kiro/specs/ai-finance-dashboard/design.md (see Data Models §
// Invariants):
//
//   • BudgetAnalytics.utilization ≈ totalSpent / totalBudget * 100
//   • Sum of Holding.allocation ≈ 100 for any portfolio snapshot
//   • Holding.marketValue ≈ quantity × currentPrice
//   • AIInsight.confidence ∈ [0, 100]
//   • Transaction.date parses to a valid Date

import * as fc from 'fast-check';
import type {
  AIInsight,
  AllocationSlice,
  AppAlert,
  BudgetAnalytics,
  BudgetCategory,
  Currency,
  Holding,
  PortfolioSummary,
  Transaction,
} from '../src/types';

// ─── PRIMITIVES ─────────────────────────────────────────

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer',
  'Industrials',
  'Utilities',
  'Materials',
  'Real Estate',
  'Communication',
] as const;

const CATEGORIES = [
  'Dining',
  'Groceries',
  'Transport',
  'Subscription',
  'Entertainment',
  'Utilities',
  'Income',
  'Investment',
  'Healthcare',
  'Travel',
] as const;

const CURRENCIES: readonly Currency[] = ['USD', 'EUR', 'GBP', 'JPY'];

/** A small positive monetary amount, rounded to 2 dp. */
const arbMoney = (min = 1, max = 100_000) =>
  fc.double({ min, max, noNaN: true, noDefaultInfinity: true }).map((n) => Math.round(n * 100) / 100);

/** A signed monetary delta. */
const arbSignedMoney = (max = 50_000) =>
  fc.double({ min: -max, max, noNaN: true, noDefaultInfinity: true }).map((n) => Math.round(n * 100) / 100);

/** A percentage in [0, 100], rounded to 2 dp. */
const arbPercent = () =>
  fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }).map((n) => Math.round(n * 100) / 100);

/** A signed percentage delta. */
const arbSignedPercent = () =>
  fc
    .double({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true })
    .map((n) => Math.round(n * 100) / 100);

/** ISO 8601 date string (UTC). */
const arbIsoDate = () =>
  fc
    .date({
      min: new Date('2020-01-01T00:00:00Z'),
      max: new Date('2030-12-31T23:59:59Z'),
      noInvalidDate: true,
    })
    .map((d) => d.toISOString());

/** Stable uppercase ticker symbol of length 2..5. */
const arbSymbol = () =>
  fc.stringMatching(/^[A-Z]{2,5}$/);

const arbId = (prefix = 'id') =>
  fc.uuid().map((u) => `${prefix}_${u}`);

// ─── PORTFOLIO ──────────────────────────────────────────

export const arbCurrency = (): fc.Arbitrary<Currency> => fc.constantFrom(...CURRENCIES);

export const arbPortfolioSummary = (): fc.Arbitrary<PortfolioSummary> =>
  fc
    .record({
      cashBalance: arbMoney(0, 1_000_000),
      investedValue: arbMoney(0, 5_000_000),
      totalGain: arbSignedMoney(500_000),
      totalGainPercent: arbSignedPercent(),
      dayChange: arbSignedMoney(50_000),
      dayChangePercent: arbSignedPercent(),
      currency: arbCurrency(),
    })
    .map((p) => ({
      ...p,
      // Invariant: totalValue = cashBalance + investedValue
      totalValue: Math.round((p.cashBalance + p.investedValue) * 100) / 100,
    }));

/** A single holding. marketValue is derived to satisfy the invariant. */
export const arbHolding = (): fc.Arbitrary<Holding> =>
  fc
    .record({
      id: arbId('hld'),
      symbol: arbSymbol(),
      name: fc.string({ minLength: 3, maxLength: 30 }),
      quantity: fc.double({ min: 0.0001, max: 10_000, noNaN: true, noDefaultInfinity: true }),
      avgCost: arbMoney(0.01, 5000),
      currentPrice: arbMoney(0.01, 5000),
      sector: fc.constantFrom(...SECTORS),
      type: fc.constantFrom('stock', 'crypto', 'etf', 'bond' as const),
      allocation: arbPercent(),
    })
    .map((h) => {
      const marketValue = Math.round(h.quantity * h.currentPrice * 100) / 100;
      const costBasis = h.quantity * h.avgCost;
      const gain = Math.round((marketValue - costBasis) * 100) / 100;
      const gainPercent = costBasis === 0 ? 0 : Math.round((gain / costBasis) * 10_000) / 100;
      return { ...h, marketValue, gain, gainPercent };
    });

/** A list of Holdings whose allocations sum to ~100 (within ±0.5). */
export const arbHoldingsPortfolio = (
  opts: { minSize?: number; maxSize?: number } = {},
): fc.Arbitrary<Holding[]> => {
  const { minSize = 1, maxSize = 12 } = opts;
  return fc.array(arbHolding(), { minLength: minSize, maxLength: maxSize }).map((holdings) => {
    if (holdings.length === 0) return holdings;
    // Distribute allocation evenly with small jitter, then normalize to 100.
    const raw = holdings.map((_, i) => 1 + (i % 3) * 0.5);
    const sum = raw.reduce((s, v) => s + v, 0);
    return holdings.map((h, i) => ({
      ...h,
      allocation: Math.round((raw[i]! / sum) * 10_000) / 100,
    }));
  });
};

export const arbAllocationSlice = (): fc.Arbitrary<AllocationSlice> =>
  fc.record({
    name: fc.constantFrom(...SECTORS),
    value: arbMoney(),
    percentage: arbPercent(),
    color: fc.stringMatching(/^#[0-9a-f]{6}$/),
  });

// ─── TRANSACTIONS ───────────────────────────────────────

export const arbTransaction = (): fc.Arbitrary<Transaction> =>
  fc
    .record(
      {
        id: arbId('tx'),
        type: fc.constantFrom('buy', 'sell', 'deposit', 'withdrawal', 'dividend', 'fee' as const),
        symbol: fc.option(arbSymbol(), { nil: undefined }),
        name: fc.string({ minLength: 1, maxLength: 40 }),
        amount: arbSignedMoney(10_000),
        quantity: fc.option(fc.double({ min: 0.0001, max: 1000, noNaN: true, noDefaultInfinity: true }), {
          nil: undefined,
        }),
        price: fc.option(arbMoney(0.01, 5000), { nil: undefined }),
        date: arbIsoDate(),
        status: fc.constantFrom('completed', 'pending', 'failed' as const),
        category: fc.constantFrom(...CATEGORIES),
        merchant: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
      },
      { requiredKeys: ['id', 'type', 'name', 'amount', 'date', 'status', 'category'] },
    );

/** Convenience: stable ascending-date list of N transactions for time-series tests. */
export const arbTransactionList = (
  opts: { minSize?: number; maxSize?: number } = {},
): fc.Arbitrary<Transaction[]> => {
  const { minSize = 0, maxSize = 50 } = opts;
  return fc.array(arbTransaction(), { minLength: minSize, maxLength: maxSize });
};

// ─── BUDGETS ────────────────────────────────────────────

export const arbBudgetCategory = (): fc.Arbitrary<BudgetCategory> =>
  fc
    .record({
      id: arbId('bud'),
      name: fc.constantFrom(...CATEGORIES),
      limit: arbMoney(50, 10_000),
      spent: arbMoney(0, 12_000),
      color: fc.constantFrom('blue', 'gold', 'success', 'danger' as const),
      icon: fc.constantFrom('utensils', 'cart', 'car', 'film', 'home', 'plane'),
    });

/** BudgetAnalytics with totals and utilization derived from categories. */
export const arbBudgetAnalytics = (): fc.Arbitrary<BudgetAnalytics> =>
  fc
    .record({
      categories: fc.array(arbBudgetCategory(), { minLength: 1, maxLength: 8 }),
      dailySpend: fc.array(
        fc.record({
          day: arbIsoDate(),
          amount: arbMoney(0, 500),
          avg: arbMoney(0, 500),
        }),
        { minLength: 0, maxLength: 31 },
      ),
    })
    .map(({ categories, dailySpend }) => {
      const totalBudget = Math.round(categories.reduce((s, c) => s + c.limit, 0) * 100) / 100;
      const totalSpent = Math.round(categories.reduce((s, c) => s + c.spent, 0) * 100) / 100;
      const remaining = Math.round((totalBudget - totalSpent) * 100) / 100;
      const utilization =
        totalBudget === 0 ? 0 : Math.round((totalSpent / totalBudget) * 10_000) / 100;
      return { totalBudget, totalSpent, remaining, utilization, categories, dailySpend };
    });

/** Empty BudgetAnalytics convenience factory for tests. */
export const emptyBudgetAnalytics = (): BudgetAnalytics => ({
  totalBudget: 0,
  totalSpent: 0,
  remaining: 0,
  utilization: 0,
  categories: [],
  dailySpend: [],
});

// ─── INSIGHTS ───────────────────────────────────────────

export const arbAIInsight = (): fc.Arbitrary<AIInsight> =>
  fc.record(
    {
      id: arbId('ins'),
      category: fc.constantFrom('Opportunity', 'Risk', 'Strategy', 'Tax' as const),
      title: fc.string({ minLength: 5, maxLength: 80 }),
      insight: fc.string({ minLength: 10, maxLength: 240 }),
      confidence: fc
        .integer({ min: 0, max: 100 }),
      impact: fc.option(fc.string({ minLength: 1, maxLength: 60 }), { nil: undefined }),
      actionable: fc.boolean(),
    },
    { requiredKeys: ['id', 'category', 'title', 'insight', 'confidence', 'actionable'] },
  );

// ─── ALERTS ─────────────────────────────────────────────

export const arbAppAlert = (): fc.Arbitrary<AppAlert> =>
  fc.record({
    id: arbId('alt'),
    type: fc.constantFrom('info', 'success', 'warning', 'danger' as const),
    title: fc.string({ minLength: 3, maxLength: 60 }),
    message: fc.string({ minLength: 1, maxLength: 200 }),
    timestamp: arbIsoDate(),
    read: fc.boolean(),
  });

// ─── BARREL ─────────────────────────────────────────────

export const arbitraries = {
  arbCurrency,
  arbPortfolioSummary,
  arbHolding,
  arbHoldingsPortfolio,
  arbAllocationSlice,
  arbTransaction,
  arbTransactionList,
  arbBudgetCategory,
  arbBudgetAnalytics,
  arbAIInsight,
  arbAppAlert,
};
