import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { type ReactNode, useRef } from 'react'
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
  /** Destructive confirmation: Base UI AlertDialog (no close on outside click) */
  alert?: boolean
  children: ReactNode
  footer: ReactNode
  /** Called on Enter / submit button */
  onSubmit?: () => void
}

/** Modal on Base UI Dialog: focus is trapped and starts on the first field, Esc and "Fechar" close it, Enter submits. */
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
  const Parts = alert ? AlertDialog : BaseDialog
  const popup = useRef<HTMLDivElement>(null)

  return (
    <Parts.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Parts.Portal>
        <Parts.Backdrop className="backdrop" />
        <Parts.Popup
          ref={popup}
          className={`popup ${variant}`}
          initialFocus={() => popup.current?.querySelector<HTMLElement>('input:not([disabled])') ?? true}
        >
          <form
            className="flex h-full flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit?.()
            }}
          >
            <div className="dialog-head">
              <div className="flex items-start gap-3">
                {icon && (
                  <span className={`ev-ic ${icon.tone}`}>
                    <Icon name={icon.name} />
                  </span>
                )}
                <div>
                  <Parts.Title className="dialog-title">{title}</Parts.Title>
                  {description && <Parts.Description className="dialog-desc">{description}</Parts.Description>}
                </div>
              </div>
              <Parts.Close className="icon-btn" aria-label="Fechar">
                <Icon name="x" />
              </Parts.Close>
            </div>
            <div className="dialog-body">{children}</div>
            <div className="dialog-foot">{footer}</div>
          </form>
        </Parts.Popup>
      </Parts.Portal>
    </Parts.Root>
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
