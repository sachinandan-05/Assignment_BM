// Sanity tests for the shared arbitraries themselves.
// Confirms invariants documented in design.md hold for every generated value.

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  arbAIInsight,
  arbAppAlert,
  arbBudgetAnalytics,
  arbHolding,
  arbHoldingsPortfolio,
  arbPortfolioSummary,
  arbTransaction,
  emptyBudgetAnalytics,
} from './arbitraries';

const RUNS = 100;

describe('arbitraries respect documented invariants', () => {
  it('Holding.marketValue ≈ quantity × currentPrice', () => {
    fc.assert(
      fc.property(arbHolding(), (h) => {
        const expected = Math.round(h.quantity * h.currentPrice * 100) / 100;
        // Tolerate floating-point rounding to 1 cent
        expect(Math.abs(h.marketValue - expected)).toBeLessThanOrEqual(0.01);
      }),
      { numRuns: RUNS },
    );
  });

  it('Σ Holding.allocation ≈ 100 for any portfolio snapshot', () => {
    fc.assert(
      fc.property(arbHoldingsPortfolio({ minSize: 1, maxSize: 12 }), (holdings) => {
        const sum = holdings.reduce((s, h) => s + h.allocation, 0);
        expect(Math.abs(sum - 100)).toBeLessThanOrEqual(0.5);
      }),
      { numRuns: RUNS },
    );
  });

  it('AIInsight.confidence ∈ [0, 100]', () => {
    fc.assert(
      fc.property(arbAIInsight(), (i) => {
        expect(i.confidence).toBeGreaterThanOrEqual(0);
        expect(i.confidence).toBeLessThanOrEqual(100);
      }),
      { numRuns: RUNS },
    );
  });

  it('Transaction.date parses to a valid Date', () => {
    fc.assert(
      fc.property(arbTransaction(), (t) => {
        const d = new Date(t.date);
        expect(Number.isFinite(d.getTime())).toBe(true);
      }),
      { numRuns: RUNS },
    );
  });

  it('AppAlert.timestamp parses to a valid Date', () => {
    fc.assert(
      fc.property(arbAppAlert(), (a) => {
        const d = new Date(a.timestamp);
        expect(Number.isFinite(d.getTime())).toBe(true);
      }),
      { numRuns: RUNS },
    );
  });

  it('BudgetAnalytics.utilization ≈ totalSpent/totalBudget * 100 (or 0 when totalBudget=0)', () => {
    fc.assert(
      fc.property(arbBudgetAnalytics(), (b) => {
        if (b.totalBudget === 0) {
          expect(b.utilization).toBe(0);
        } else {
          const expected = (b.totalSpent / b.totalBudget) * 100;
          expect(Math.abs(b.utilization - expected)).toBeLessThanOrEqual(0.01);
        }
      }),
      { numRuns: RUNS },
    );
  });

  it('PortfolioSummary.totalValue = cashBalance + investedValue', () => {
    fc.assert(
      fc.property(arbPortfolioSummary(), (p) => {
        const expected = Math.round((p.cashBalance + p.investedValue) * 100) / 100;
        expect(Math.abs(p.totalValue - expected)).toBeLessThanOrEqual(0.01);
      }),
      { numRuns: RUNS },
    );
  });

  it('emptyBudgetAnalytics() returns the documented zero value', () => {
    const e = emptyBudgetAnalytics();
    expect(e.totalBudget).toBe(0);
    expect(e.totalSpent).toBe(0);
    expect(e.remaining).toBe(0);
    expect(e.utilization).toBe(0);
    expect(e.categories).toEqual([]);
    expect(e.dailySpend).toEqual([]);
  });
});
