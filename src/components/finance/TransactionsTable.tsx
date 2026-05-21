import { memo, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import type { Transaction } from '@/types';

// ─────────────────────────────────────────────────
// TRANSACTIONS TABLE — Activity feed with status
// ─────────────────────────────────────────────────

interface TransactionsTableProps {
  transactions: readonly Transaction[];
  /** Optional case-insensitive substring filter applied to name + category. */
  searchQuery?: string;
  /** Optional category filter. */
  categoryFilter?: string;
}

const typeConfig: Record<
  string,
  {
    color: string;
    badgeVariant: 'success' | 'danger' | 'default' | 'warning' | 'neutral';
    icon: React.ElementType;
  }
> = {
  buy: { color: 'text-success', badgeVariant: 'success', icon: ArrowUpRight },
  sell: { color: 'text-alert', badgeVariant: 'danger', icon: ArrowDownRight },
  dividend: { color: 'text-blue-400', badgeVariant: 'default', icon: ArrowUpRight },
  deposit: { color: 'text-success', badgeVariant: 'success', icon: ArrowUpRight },
  withdrawal: { color: 'text-alert', badgeVariant: 'danger', icon: ArrowDownRight },
  fee: { color: 'text-warning', badgeVariant: 'warning', icon: Minus },
};

const statusBadge: Record<string, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

interface RowProps {
  tx: Transaction;
}

const TransactionRow = memo(function TransactionRow({ tx }: RowProps) {
  const config = typeConfig[tx.type] ?? typeConfig.buy!;
  const Icon = config.icon;
  const isOutflow = tx.type === 'sell' || tx.type === 'withdrawal' || tx.type === 'fee';

  return (
    <tr className="border-b border-edge-subtle/60 hover:bg-surface-low transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded-lg bg-surface-mid', config.color)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <Badge variant={config.badgeVariant} size="sm">
            {tx.type.toUpperCase()}
          </Badge>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-text-primary font-medium">{tx.name}</div>
        {tx.symbol && (
          <div className="text-xs text-text-faint">
            {tx.quantity && `${tx.quantity} shares`}
            {tx.price && ` @ ${formatCurrency(tx.price)}`}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'text-sm font-mono font-semibold',
            isOutflow ? 'text-alert' : 'text-success',
          )}
        >
          {isOutflow ? '-' : '+'}
          {formatCurrency(tx.amount)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-text-muted">{tx.category}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-text-muted">
          {formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusBadge[tx.status] ?? 'neutral'} size="sm" dot>
          {tx.status}
        </Badge>
      </td>
    </tr>
  );
});

function TransactionsTableImpl({
  transactions,
  searchQuery = '',
  categoryFilter = '',
}: TransactionsTableProps) {
  // Memoize filtering so re-renders without input changes don't re-run the loop.
  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (categoryFilter && tx.category !== categoryFilter) return false;
      if (!needle) return true;
      return (
        tx.name.toLowerCase().includes(needle) ||
        tx.category.toLowerCase().includes(needle) ||
        (tx.merchant?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [transactions, searchQuery, categoryFilter]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-edge-subtle">
            {['Type', 'Description', 'Amount', 'Category', 'Date', 'Status'].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-[11px] font-semibold text-text-faint uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const TransactionsTable = memo(TransactionsTableImpl);
TransactionsTable.displayName = 'TransactionsTable';
