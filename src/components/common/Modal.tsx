/**
 * Modal.tsx — Accessible dialog wrapper.
 *
 * Wraps any content in a centered overlay with a backdrop.
 * Handles Escape key dismissal and backdrop click dismissal so every
 * dialog in the app gets these behaviours for free (Open/Closed Principle —
 * extend by passing different children, not by modifying this file).
 *
 * Accessibility: role="dialog", aria-modal, aria-labelledby, and Escape key
 * support satisfy NFR-08 and NFR-11 (WCAG 2.1 AA) for modal interactions.
 */

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  /** Controls whether the dialog is visible. */
  isOpen: boolean;
  /** Called when the user dismisses the dialog (Escape key or backdrop click). */
  onClose: () => void;
  /** Shown in the dialog header and linked via aria-labelledby. */
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close the modal when the user presses Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Move focus into the dialog when it opens so keyboard users don't get stranded
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Full-screen fixed overlay — z-50 keeps the modal above all other content
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop — clicking it dismisses the dialog */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            {/* X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Dialog body — content is provided by the caller */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
