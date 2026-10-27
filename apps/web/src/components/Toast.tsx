import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'
import { Icon, type IconName } from '#/components/Icon'

type Toast = { id: number; title: string; description?: ReactNode; tone?: 'in' | 'open' | 'out'; icon?: IconName }

const ToastContext = createContext<(toast: Omit<Toast, 'id'>) => void>(() => {})

/** Success feedback: `const toast = useToast(); toast({ title: 'Usuário cadastrado' })`. Toasts close after 5 s. */
export const useToast = () => useContext(ToastContext)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const show = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = ++nextId
      setToasts((list) => [...list, { ...toast, id }])
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" role="status" key={t.id}>
            <span className={`ev-ic t-${t.tone ?? 'in'}`} style={{ width: 32, height: 32 }}>
              <Icon name={t.icon ?? 'check'} size="sm" />
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="toast-title">{t.title}</span>
              {t.description && <span className="toast-desc">{t.description}</span>}
            </span>
            <button
              className="icon-btn"
              type="button"
              aria-label="Fechar aviso"
              style={{ width: 28, height: 28 }}
              onClick={() => dismiss(t.id)}
            >
              <Icon name="x" size="sm" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
