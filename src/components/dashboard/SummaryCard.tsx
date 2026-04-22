/**
 * SummaryCard.tsx — A single metric card for the dashboard summary row.
 *
 * Displays one key number (e.g. all-time total) with a title, optional subtitle,
 * and a coloured icon. All three summary cards (FR-15, FR-16, FR-17) reuse this
 * component — changing the card layout means one edit here, not three (SRP).
 */

import type { ReactNode } from 'react';

interface SummaryCardProps {
  /** Card heading shown above the value. */
  title: string;
  /** The primary value displayed large and bold. */
  value: string;
  /** Optional secondary line shown below the value. */
  subtitle?: string;
  /** Icon element rendered inside the coloured circle. */
  icon: ReactNode;
  /** Tailwind background colour class for the icon circle. e.g. 'bg-indigo-100' */
  iconBg: string;
  /** Tailwind text colour class for the icon. e.g. 'text-indigo-600' */
  iconColor: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-start gap-4">
      {/* Coloured icon circle — provides visual differentiation beyond colour alone (NFR-10) */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
