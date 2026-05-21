import { motion } from 'framer-motion';
import { WatchlistWidget } from '@/components/finance/WatchlistWidget';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/finance/SEO';
import { Plus } from 'lucide-react';

// ─────────────────────────────────────────────────
// WATCHLIST PAGE – Asset tracking
// ─────────────────────────────────────────────────

export default function WatchlistPage() {
  return (
    <>
      <SEO
        title="Watchlist"
        description="Track assets you are researching and monitor real-time price movements."
      />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Watchlist</h1>
            <p className="text-sm text-text-faint mt-1">
              Track assets you&apos;re interested in.
            </p>
          </div>
          <Button variant="premium" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Asset
          </Button>
        </div>

        <div className="max-w-2xl">
          <WatchlistWidget />
        </div>
      </motion.div>
    </>
  );
}
