/**
 * CategoryBreakdown.tsx — Per-category spending breakdown (FR-17).
 *
 * Renders a list of categories with their total amount, percentage share,
 * and a proportional colour bar. The bar width is driven by percentage,
 * and the amount label is always shown — colour is never the sole indicator (NFR-10).
 */

import type { CategoryTotal } from '../../utils/dashboardUtils';
import { getCategoryMeta } from '../../utils';
import { formatCurrency } from '../../utils';

interface CategoryBreakdownProps {
  /** Category totals sorted by amount descending (categories with £0 excluded). */
  totals: CategoryTotal[];
}

export function CategoryBreakdown({ totals }: CategoryBreakdownProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h2>

      {totals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No category data to display yet.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Spending breakdown by category">
          {totals.map(({ category, total, percentage }) => {
            const meta = getCategoryMeta(category);

            return (
              <li key={category}>
                {/* Row: category name + amount + percentage */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {/*
                      Colour dot — purely decorative; the text label is the
                      primary identifier so colour is not the sole conveyor (NFR-10).
                    */}
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: meta.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-700">{meta.label}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                    <span className="text-gray-400 w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Proportional bar — width driven by percentage value */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width:           `${Math.min(percentage, 100)}%`,
                      backgroundColor: meta.color,
                    }}
                    role="progressbar"
                    aria-valuenow={Math.round(percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.label}: ${percentage.toFixed(0)}% of total spending`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
