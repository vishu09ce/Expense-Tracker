/**
 * ConfirmDialog.tsx — Reusable confirmation dialog for destructive actions.
 *
 * Wraps Modal to provide a standard "are you sure?" pattern used for deletions (FR-03).
 * Keeping this separate from the delete logic means any future destructive action
 * in the app can reuse the same pattern with different labels (Single Responsibility).
 */

import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  /** Controls visibility of the dialog. */
  isOpen: boolean;
  /** Dialog heading. */
  title: string;
  /** Explanatory message shown to the user before they confirm. */
  message: string;
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void;
  /** Called when the user clicks cancel or dismisses the dialog. */
  onCancel: () => void;
  /** Label for the confirm button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      {/* Warning message */}
      <p className="text-sm text-gray-600 mb-6">{message}</p>

      {/* Action row — cancel on the left, destructive action on the right */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
