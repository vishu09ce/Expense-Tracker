/**
 * categoryUtils.ts — Display metadata for each expense category.
 *
 * Centralising colours and labels here means adding or renaming a category
 * in the future is a single change in this file — not a hunt across components
 * (Open/Closed Principle).
 *
 * Colours match the CSS variables defined in index.css so the chart, badges,
 * and any other visual elements stay consistent without duplicating hex values.
 */

import type { Category } from '../types';
import { Category as CategoryValues } from '../types';

/** Visual metadata for a single category. */
export interface CategoryMeta {
  /** The label shown in dropdowns, badges, and charts. */
  label: string;
  /** Solid colour used for text, icons, and chart segments. */
  color: string;
  /** Light tint used for badge backgrounds. */
  bgColor: string;
}

/**
 * Lookup table mapping each Category value to its display metadata.
 * Using a plain Record means TypeScript enforces exhaustiveness —
 * forgetting to add a new category here is a compile error.
 */
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  [CategoryValues.Food]: {
    label:   'Food',
    color:   '#f59e0b', // amber-500
    bgColor: '#fffbeb', // amber-50
  },
  [CategoryValues.Transportation]: {
    label:   'Transportation',
    color:   '#3b82f6', // blue-500
    bgColor: '#eff6ff', // blue-50
  },
  [CategoryValues.Entertainment]: {
    label:   'Entertainment',
    color:   '#8b5cf6', // violet-500
    bgColor: '#f5f3ff', // violet-50
  },
  [CategoryValues.Shopping]: {
    label:   'Shopping',
    color:   '#ec4899', // pink-500
    bgColor: '#fdf2f8', // pink-50
  },
  [CategoryValues.Bills]: {
    label:   'Bills',
    color:   '#ef4444', // red-500
    bgColor: '#fef2f2', // red-50
  },
  [CategoryValues.Other]: {
    label:   'Other',
    color:   '#6b7280', // gray-500
    bgColor: '#f9fafb', // gray-50
  },
};

/** Convenience accessor — returns the CategoryMeta for a given category value. */
export function getCategoryMeta(category: Category): CategoryMeta {
  return CATEGORY_META[category];
}

/**
 * Returns all category values in display order.
 * Components that render a full category list (dropdowns, filter panels)
 * import this rather than hardcoding the array.
 */
export const ALL_CATEGORIES: Category[] = Object.values(CategoryValues) as Category[];
