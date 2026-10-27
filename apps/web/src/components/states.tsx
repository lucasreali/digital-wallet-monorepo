import type { CSSProperties, ReactNode } from 'react'
import { Icon } from '#/components/Icon'

/** Shimmer block shaped like the content it replaces (isPending). */
export function Skeleton({
  width,
  height,
  radius,
}: {
  width: CSSProperties['width']
  height: number
  radius?: number
}) {
  return <span className="skel block" style={{ width, height, borderRadius: radius }} />
}

/** Skeleton rows in the event-list format, for lists and feeds. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">Carregando</span>
      {Array.from({ length: rows }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
        <div className="ev" key={i}>
          <Skeleton width={36} height={36} radius={10} />
          <span className="flex flex-col gap-2">
            <Skeleton width={120 + ((i * 37) % 60)} height={13} />
            <Skeleton width={200 + ((i * 53) % 80)} height={11} />
          </span>
          <Skeleton width={70} height={11} />
        </div>
      ))}
    </div>
  )
}

/** Spinner icon for buttons in progress ("Salvando…"). */
export const Spinner = () => <Icon name="loader" size="sm" className="spin" />

const illustrations = {
  users: (
    <>
      <ellipse cx="84" cy="70" rx="72" ry="52" style={{ fill: 'var(--primary-soft)' }} />
      <rect
        x="40"
        y="34"
        width="88"
        height="62"
        rx="12"
        style={{ fill: 'var(--surface)', stroke: 'var(--border-strong)', strokeWidth: 1.5 }}
      />
      <circle
        cx="62"
        cy="58"
        r="10"
        style={{ fill: 'var(--primary-soft)', stroke: 'var(--primary)', strokeWidth: 1.5 }}
      />
      <rect x="80" y="51" width="34" height="6" rx="3" style={{ fill: 'var(--border-strong)' }} />
      <rect x="80" y="62" width="22" height="6" rx="3" style={{ fill: 'var(--border)' }} />
      <rect x="52" y="78" width="62" height="6" rx="3" style={{ fill: 'var(--border)' }} />
      <circle cx="128" cy="34" r="14" style={{ fill: 'var(--primary)' }} />
      <path
        d="M128 28v12M122 34h12"
        style={{ stroke: 'var(--on-primary)', strokeWidth: 2.5, strokeLinecap: 'round' }}
      />
      <circle cx="34" cy="96" r="7" style={{ fill: 'none', stroke: 'var(--primary)', strokeWidth: 1.5 }} />
    </>
  ),
  wallets: (
    <>
      <ellipse cx="84" cy="70" rx="72" ry="52" style={{ fill: 'var(--primary-soft)' }} />
      <rect
        x="40"
        y="38"
        width="88"
        height="56"
        rx="10"
        style={{ fill: 'var(--surface)', stroke: 'var(--border-strong)', strokeWidth: 1.5 }}
      />
      <rect x="40" y="38" width="88" height="14" rx="7" style={{ fill: 'var(--surface-2)' }} />
      <rect
        x="96"
        y="62"
        width="32"
        height="16"
        rx="8"
        style={{ fill: 'var(--primary-soft)', stroke: 'var(--primary)', strokeWidth: 1.5 }}
      />
      <circle cx="106" cy="70" r="3" style={{ fill: 'var(--primary)' }} />
      <rect x="52" y="64" width="30" height="6" rx="3" style={{ fill: 'var(--border)' }} />
      <circle cx="128" cy="34" r="14" style={{ fill: 'var(--primary)' }} />
      <path
        d="M128 28v12M122 34h12"
        style={{ stroke: 'var(--on-primary)', strokeWidth: 2.5, strokeLinecap: 'round' }}
      />
    </>
  ),
  events: (
    <>
      <ellipse cx="84" cy="70" rx="72" ry="52" style={{ fill: 'var(--primary-soft)' }} />
      <path
        d="M30 72h26l10-22 16 40 12-30 8 12h36"
        style={{
          fill: 'none',
          stroke: 'var(--primary)',
          strokeWidth: 2.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
      <circle cx="138" cy="72" r="5" style={{ fill: 'var(--surface)', stroke: 'var(--primary)', strokeWidth: 2 }} />
    </>
  ),
}

type EmptyProps = {
  illustration: keyof typeof illustrations
  title: string
  description: ReactNode
  action?: ReactNode
}

/** Empty list: illustration + sentence + action. */
export function EmptyState({ illustration, title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center" style={{ padding: '36px 24px' }}>
      <svg width="168" height="128" viewBox="0 0 168 128" aria-hidden="true">
        {illustrations[illustration]}
      </svg>
      <span className="h2">{title}</span>
      <span className="muted" style={{ fontSize: 13.5 }}>
        {description}
      </span>
      {action}
    </div>
  )
}

type ErrorProps = {
  description: ReactNode
  title?: string
  onRetry?: () => void
  retrying?: boolean
}

/** Failed request (isError): only the affected card shows it, with a retry button. */
export function ErrorState({
  description,
  title = 'Não foi possível falar com o servidor',
  onRetry,
  retrying,
}: ErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center" style={{ padding: '36px 28px' }} role="alert">
      <span
        className="flex items-center justify-center"
        style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--danger-soft)', color: 'var(--danger)' }}
      >
        <Icon name="wifiOff" size="lg" />
      </span>
      <span className="h2">{title}</span>
      <span className="muted" style={{ fontSize: 13.5 }}>
        {description}
      </span>
      {onRetry && (
        <button className="btn btn-secondary" type="button" onClick={onRetry} disabled={retrying} aria-busy={retrying}>
          {retrying ? <Spinner /> : <Icon name="refresh" size="sm" />}
          {retrying ? 'Tentando novamente…' : 'Tentar novamente'}
        </button>
      )}
    </div>
  )
}
