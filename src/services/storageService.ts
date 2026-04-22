/**
 * storageService.ts — Shared storage service instance (factory/singleton).
 *
 * Exports a single instance typed as IStorageService (the abstraction), not as
 * LocalStorageService (the implementation). This means every consumer in the
 * codebase is already decoupled from the concrete class.
 *
 * To switch backends: replace LocalStorageService with any class that satisfies
 * IStorageService — no other file needs to change.
 */

import { LocalStorageService } from './LocalStorageService';
import type { IStorageService } from './IStorageService';

const storageService: IStorageService = new LocalStorageService();

export default storageService;
