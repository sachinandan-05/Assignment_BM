import { motion } from 'framer-motion';
import { PerformanceChart } from '@/components/finance/PerformanceChart';
import { AllocationChart } from '@/components/finance/AllocationChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/finance/SEO';
import { mockSectorExposure } from '@/data/mock';
import { formatPercentage } from '@/utils';
import { cn } from '@/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// ─────────────────────────────────────────────────
// ANALYTICS PAGE – Performance & sector analysis
// ─────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        title="Analytics"
        description="Deep-dive into portfolio analytics, sector exposure, and performance metrics versus benchmark."
      />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Analytics</h1>
          <p className="text-sm text-text-faint mt-1">
            Deep-dive into your portfolio performance and exposure.
          </p>
        </div>

        {/* Performance + Allocation */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <PerformanceChart />
          <AllocationChart />
        </div>

        {/* Sector Exposure Table */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Sector Exposure</CardTitle>
            <Badge variant="default" size="sm">
              {mockSectorExposure.length} sectors
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-edge-subtle">
                    {['Sector', 'Allocation', 'Return', 'Holdings', 'Exposure Bar'].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-semibold text-text-faint uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockSectorExposure.map((sector, i) => (
                    <motion.tr
                      key={sector.sector}
                      className="border-b border-edge-subtle/50 hover:bg-surface-mid/50 transition-colors"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-text-primary">{sector.sector}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-text-secondary">{sector.allocation}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={cn(
                          'inline-flex items-center gap-1 text-sm font-mono font-semibold',
                          sector.gain >= 0 ? 'text-success' : 'text-alert',
                        )}>
                          {sector.gain >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {formatPercentage(sector.gain)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">{sector.holdings} assets</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full max-w-[200px] h-2 rounded-full bg-surface-mid overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${sector.allocation * 2}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
