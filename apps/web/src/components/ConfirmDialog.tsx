import { Field } from '@base-ui/react/field'
import { type ReactNode, useEffect, useState } from 'react'
import { AlertError, Dialog, DialogActions } from '#/components/Dialog'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: ReactNode
  confirmLabel: string
  pendingLabel: string
  pending?: boolean
  /** When set, the user must type this text to enable the button (e.g. the user's name). */
  confirmText?: string
  /** API refusal, e.g. "409 · User still owns a wallet" */
  error?: string
}

/** Destructive confirmation (delete user, close wallet) that also shows the API refusal. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  pendingLabel,
  pending,
  confirmText,
  error,
}: Props) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (open) setTyped('')
  }, [open])
  const blocked = !!confirmText && typed.trim() !== confirmText

  return (
    <Dialog
      open={open}
      onClose={onClose}
      alert
      title={title}
      description={description}
      icon={{ name: 'trash', tone: 't-out' }}
      onSubmit={() => !blocked && onConfirm()}
      footer={
        <DialogActions
          onCancel={onClose}
          label={confirmLabel}
          pendingLabel={pendingLabel}
          pending={pending}
          disabled={blocked}
          danger
        />
      }
    >
      {confirmText && (
        <Field.Root className="field">
          <Field.Label className="label">
            Digite <span style={{ fontWeight: 800 }}>{confirmText}</span> para confirmar
          </Field.Label>
          <Field.Control className="input" value={typed} onValueChange={setTyped} autoComplete="off" />
        </Field.Root>
      )}
      <AlertError title="Não foi possível concluir" message={error} />
    </Dialog>
  )
}
