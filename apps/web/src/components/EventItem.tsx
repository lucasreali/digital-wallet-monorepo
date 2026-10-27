import { Icon, type IconName } from '#/components/Icon'
import { brl, relativeTime, time } from '#/lib/format'
import type { ActivityEvent, EventType } from '#/lib/types'

export const eventMeta: Record<EventType, { title: string; tone: string; icon: IconName; source: string }> = {
  Deposit: { title: 'Depósito', tone: 't-in', icon: 'deposit', source: 'svc-carteira' },
  Withdrawal: { title: 'Saque', tone: 't-out', icon: 'withdraw', source: 'svc-carteira' },
  UserCreated: { title: 'Usuário cadastrado', tone: 't-user', icon: 'userPlus', source: 'svc-identidade' },
  WalletOpened: { title: 'Carteira aberta', tone: 't-open', icon: 'wallet', source: 'svc-carteira' },
  WalletClosed: { title: 'Carteira encerrada', tone: 't-close', icon: 'xCircle', source: 'svc-carteira' },
}

type EventData = { name?: string; ownerId?: string; userId?: string; amount?: number }

/** One row of the event feed (Painel and Atividade). `names` maps user ids to names for the description. */
export function EventItem({ event, names }: { event: ActivityEvent; names?: Map<string, string> }) {
  const meta = eventMeta[event.type]
  const data = event.data as EventData
  const who = data.name ?? names?.get(data.ownerId ?? data.userId ?? '') ?? 'Usuário removido'
  const description = {
    Deposit: `${who} depositou ${brl(data.amount ?? 0)}`,
    Withdrawal: `${who} sacou ${brl(data.amount ?? 0)}`,
    UserCreated: `${who} foi cadastrado(a)`,
    WalletOpened: `Carteira de ${who} aberta`,
    WalletClosed: `Carteira de ${who} encerrada`,
  }[event.type]
  const hasAmount = data.amount != null && (event.type === 'Deposit' || event.type === 'Withdrawal')

  return (
    <div className="ev">
      <span className={`ev-ic ${meta.tone}`}>
        <Icon name={meta.icon} />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="ev-title">{meta.title}</span>
        <span className="ev-desc">{description}</span>
      </div>
      <div className="ev-meta">
        {hasAmount && (
          <span className={`num ${event.type === 'Deposit' ? 'in' : 'out'}`} style={{ fontSize: 14, fontWeight: 600 }}>
            {event.type === 'Deposit' ? '+ ' : '− '}
            {brl(data.amount ?? 0)}
          </span>
        )}
        <span>
          {relativeTime(event.occurredAt)} · <span className="num">{time(event.occurredAt)}</span>
        </span>
        <span className="src">{meta.source}</span>
      </div>
    </div>
  )
}
