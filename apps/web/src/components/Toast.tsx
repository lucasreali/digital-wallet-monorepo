import { Toast as BaseToast } from '@base-ui/react/toast'
import { type ReactNode, useCallback } from 'react'
import { Icon, type IconName } from '#/components/Icon'

type ToastData = { tone?: 'in' | 'open' | 'out'; icon?: IconName }
type ToastInput = ToastData & { title: string; description?: ReactNode }

/** Success feedback: `const toast = useToast(); toast({ title: 'Usuário cadastrado' })`. Toasts close after 5 s. */
export function useToast() {
  const { add } = BaseToast.useToastManager<ToastData>()
  return useCallback(
    ({ title, description, tone, icon }: ToastInput) => add({ title, description, data: { tone, icon } }),
    [add],
  )
}

/** Base UI toasts: announced to screen readers, paused on hover/focus, swipe or "Fechar aviso" to dismiss. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <BaseToast.Provider timeout={5000}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="toasts">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>()
  return toasts.map((t) => (
    <BaseToast.Root key={t.id} toast={t} className="toast">
      <span className={`ev-ic t-${t.data?.tone ?? 'in'}`} style={{ width: 32, height: 32 }}>
        <Icon name={t.data?.icon ?? 'check'} size="sm" />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <BaseToast.Title className="toast-title" />
        <BaseToast.Description className="toast-desc" />
      </span>
      <BaseToast.Close className="icon-btn" aria-label="Fechar aviso" style={{ width: 28, height: 28 }}>
        <Icon name="x" size="sm" />
      </BaseToast.Close>
    </BaseToast.Root>
  ))
}
