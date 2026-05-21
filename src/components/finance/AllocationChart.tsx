import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { useAllocation } from '@/hooks/useFinance';
import {
  chartLegendStyle,
  chartTooltipItemStyle,
  chartTooltipStyle,
} from '@/utils/chartTheme';

export function AllocationChart() {
  const { data, isLoading } = useAllocation();

  if (isLoading) return <ChartSkeleton height={320} />;

  return (
    <Card padding="lg" className="xl:col-span-4">
      <CardHeader>
        <CardTitle className="text-headline-sm">Asset Allocation</CardTitle>
      </CardHeader>

      <div className="h-[340px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={chartTooltipStyle}
              itemStyle={chartTooltipItemStyle}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 24, ...chartLegendStyle }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full px-2">
          {(data || []).map((slice) => (
            <div key={slice.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-xs text-text-muted truncate">{slice.name}</span>
                <span className="text-xs font-medium text-text-secondary ml-2">{slice.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
