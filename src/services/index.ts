/**
 * index.ts — Barrel export for the services layer.
 * Import from '../services' to avoid reaching into individual files.
 */

export type { IStorageService } from './IStorageService';
export { LocalStorageService } from './LocalStorageService';
export { default as storageService } from './storageService';
