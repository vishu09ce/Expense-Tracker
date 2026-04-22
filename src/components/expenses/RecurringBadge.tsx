/**
 * RecurringBadge.tsx — Visual indicator for recurring expenses (FR-27).
 *
 * Displayed on any expense row where isRecurring is true.
 * Using a dedicated component means the visual treatment can be updated
 * in one place without touching ExpenseRow or any other consumer.
 *
 * The badge uses both an icon and a text label so color is never the sole
 * conveyor of meaning — satisfying NFR-10 (color contrast) and NFR-09 (aria labels).
 */

interface RecurringBadgeProps {
  /** The recurrence frequency label shown inside the badge. */
  frequency: string;
}

export function RecurringBadge({ frequency }: RecurringBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
      aria-label={`Recurring: ${frequency}`}
    >
      {/* Repeat icon — provides a non-text visual cue alongside the label */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      {frequency}
    </span>
  );
}
