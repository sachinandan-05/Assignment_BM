import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatCurrency, formatPercentage } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import type { Holding } from '@/types';

// ─────────────────────────────────────────────────
// HOLDINGS TABLE — Portfolio positions list
// ─────────────────────────────────────────────────

interface HoldingsTableProps {
  holdings: readonly Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-edge-subtle">
            {['Symbol', 'Quantity', 'Avg Cost', 'Price', 'Value', 'Gain $', 'Gain %', 'Allocation'].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-[11px] font-semibold text-text-faint uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const isPositive = holding.gainPercent >= 0;
            return (
              <tr
                key={holding.id}
                className="border-b border-edge-subtle/60 hover:bg-surface-low transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-mid border border-edge-subtle flex items-center justify-center">
                      <span className="text-[11px] font-bold text-text-secondary">
                        {holding.symbol.slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-text-primary font-semibold">{holding.symbol}</div>
                      <div className="text-xs text-text-faint truncate max-w-[160px]">{holding.name}</div>
                    </div>
                    <Badge variant="neutral" size="sm" className="ml-2">
                      {holding.type.toUpperCase()}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary font-mono">
                  {holding.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-text-muted font-mono">
                  {formatCurrency(holding.avgCost)}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary font-mono font-medium">
                  {formatCurrency(holding.currentPrice)}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary font-mono font-semibold">
                  {formatCurrency(holding.marketValue)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-sm font-mono font-medium',
                      isPositive ? 'text-success' : 'text-alert',
                    )}
                  >
                    {formatCurrency(holding.gain)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-mono font-semibold',
                      isPositive ? 'text-success' : 'text-alert',
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {formatPercentage(holding.gainPercent)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-surface-mid overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${Math.min(holding.allocation * 4, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-mono">{holding.allocation}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
