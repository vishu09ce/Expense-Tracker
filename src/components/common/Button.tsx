/**
 * Button.tsx — Reusable button component.
 *
 * Centralises all button variants so visual changes propagate from one file.
 * Every interactive element in the app that triggers an action uses this component,
 * which ensures keyboard navigability and focus styles are never missed (NFR-08).
 */

import type { ReactNode } from 'react';

interface ButtonProps {
  /** Visual style of the button. Defaults to 'primary'. */
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
  /** Size of the button. Defaults to 'md'. */
  size?: 'sm' | 'md';
  /** HTML button type. Defaults to 'button' to prevent accidental form submissions. */
  type?: 'button' | 'submit' | 'reset';
  /** Disables the button and shows a muted style when true. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Accessible label for icon-only buttons (NFR-09). */
  'aria-label'?: string;
  children: ReactNode;
  /** Extra Tailwind classes for one-off layout overrides. */
  className?: string;
}

/** Tailwind class sets for each variant. */
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  danger:    'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
  ghost:     'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  children,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        // Base styles applied to every button variant
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-md',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
