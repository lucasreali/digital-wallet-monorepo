import { type ReactNode, useEffect, useRef } from 'react'
import { Icon, type IconName } from '#/components/Icon'
import { Spinner } from '#/components/states'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  /** Small tinted icon next to the title, e.g. { name: 'deposit', tone: 't-in' } */
  icon?: { name: IconName; tone: string }
  /** 'sheet' slides in from the right (edit forms) */
  variant?: 'dialog' | 'sheet'
  alert?: boolean
  children: ReactNode
  footer: ReactNode
  /** Called on Enter / submit button */
  onSubmit?: () => void
}

/** Modal on the native <dialog>: focus is trapped, Esc and "Fechar" close it, Enter submits the form. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  icon,
  variant = 'dialog',
  alert,
  children,
  footer,
  onSubmit,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog?.open) dialog?.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className={variant} onClose={onClose} role={alert ? 'alertdialog' : undefined}>
      <form
        className="flex h-full flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
        <div
          className="dialog-head"
          style={variant === 'sheet' ? { padding: '22px 24px', borderBottom: '1px solid var(--border)' } : undefined}
        >
          <div className="flex items-start gap-3">
            {icon && (
              <span className={`ev-ic ${icon.tone}`}>
                <Icon name={icon.name} />
              </span>
            )}
            <div>
              <h2 className="dialog-title">{title}</h2>
              {description && <p className="dialog-desc">{description}</p>}
            </div>
          </div>
          <button className="icon-btn" type="button" aria-label="Fechar" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="dialog-body" style={variant === 'sheet' ? { flex: 1 } : undefined}>
          {children}
        </div>
        <div className="dialog-foot" style={variant === 'sheet' ? { borderRadius: 0 } : undefined}>
          {footer}
        </div>
      </form>
    </dialog>
  )
}

/** Footer buttons: Cancelar + primary submit that shows a spinner while pending. */
export function DialogActions({
  onCancel,
  label,
  pendingLabel,
  pending,
  danger,
  disabled,
}: {
  onCancel: () => void
  label: ReactNode
  pendingLabel: string
  pending?: boolean
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <>
      <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={pending}>
        Cancelar
      </button>
      <button
        className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
        type="submit"
        disabled={pending || disabled}
        aria-busy={pending}
      >
        {pending && <Spinner />}
        {pending ? pendingLabel : label}
      </button>
    </>
  )
}

/** Inline API refusal shown inside a dialog. */
export function AlertError({ title, message }: { title: string; message?: string }) {
  if (!message) return null
  return (
    <div className="alert alert-danger" role="alert">
      <Icon name="alertCircle" size="sm" />
      <span className="flex flex-col gap-0.5">
        <span style={{ fontWeight: 700 }}>{title}</span>
        <span>{message}</span>
      </span>
    </div>
  )
}
