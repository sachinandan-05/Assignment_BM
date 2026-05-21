import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatCurrency, formatPercentage } from '@/utils';
import type { Holding } from '@/types';

// ─────────────────────────────────────────────────
// HOLDING CARD — Individual asset position display
// ─────────────────────────────────────────────────

interface HoldingCardProps {
  holding: Holding;
  index?: number;
}

const typeColors: Record<string, string> = {
  stock: 'bg-blue-600/15 text-blue-400',
  etf: 'bg-blue-300/15 text-blue-300',
  crypto: 'bg-gold-500/12 text-gold-500',
  bond: 'bg-success/12 text-success',
  commodity: 'bg-warning/12 text-warning',
  reit: 'bg-alert/12 text-alert',
};

function HoldingCardImpl({ holding, index = 0 }: HoldingCardProps) {
  const isPositive = holding.gainPercent >= 0;

  return (
    <motion.div
      className="bento-card rounded-2xl p-4 group cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-mid flex items-center justify-center border border-edge-subtle">
            <span className="text-xs font-bold text-text-secondary">
              {holding.symbol.slice(0, 3)}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">{holding.symbol}</h4>
            <p className="text-xs text-text-faint truncate max-w-[120px]">{holding.name}</p>
          </div>
        </div>
        <span
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full',
            typeColors[holding.type] ?? typeColors.stock,
          )}
        >
          {holding.type.toUpperCase()}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-text-primary font-mono">
            {formatCurrency(holding.marketValue)}
          </div>
          <div className="text-xs text-text-faint mt-0.5">
            {holding.quantity} × {formatCurrency(holding.currentPrice)}
          </div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              'flex items-center gap-0.5 justify-end',
              isPositive ? 'text-success' : 'text-alert',
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span className="text-sm font-semibold font-mono">
              {formatPercentage(holding.gainPercent)}
            </span>
          </div>
          <div
            className={cn(
              'text-xs font-mono',
              isPositive ? 'text-success/80' : 'text-alert/80',
            )}
          >
            {formatCurrency(holding.gain)}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-edge-subtle">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-text-faint">Allocation</span>
          <span className="text-text-secondary font-medium">{holding.allocation}%</span>
        </div>
        <div className="w-full h-1 rounded-full bg-surface-mid overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${holding.allocation}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export const HoldingCard = memo(HoldingCardImpl);
HoldingCard.displayName = 'HoldingCard';
