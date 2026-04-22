/**
 * SpendingChart.tsx — Monthly spending bar chart (FR-18).
 *
 * Renders a Recharts BarChart showing total spending per calendar month.
 * ResponsiveContainer ensures the chart fills its parent at any screen width (NFR-04–06).
 *
 * An empty state is shown when there is no data rather than rendering an empty chart,
 * which would be confusing and visually broken.
 */

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { MonthlyTotal } from '../../utils/dashboardUtils';
import { formatCurrency } from '../../utils';

interface SpendingChartProps {
  /** Monthly aggregated totals in chronological order. */
  data: MonthlyTotal[];
}

/** Custom tooltip shown on bar hover — formats the amount as currency. */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Spending Over Time</h2>

      {data.length === 0 ? (
        // Empty state — shown when there are no expenses to chart yet
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          No spending data to display yet.
        </div>
      ) : (
        /* aria-label gives screen readers a description of the chart (NFR-09) */
        <div role="img" aria-label="Bar chart showing monthly spending totals">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              {/* Horizontal grid lines only — vertical lines add visual clutter */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                // Prefix each Y-axis tick with "$" for readability
                tickFormatter={(v: number) => `$${v}`}
                width={55}
              />

              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />

              <Bar
                dataKey="total"
                fill="#4f46e5"        // indigo-600 — matches primary brand colour
                radius={[4, 4, 0, 0]} // rounded top corners
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
