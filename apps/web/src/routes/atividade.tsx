import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { EventItem, eventMeta } from '#/components/EventItem'
import { Icon } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { EmptyState, ErrorState, ListSkeleton, Spinner } from '#/components/states'
import { useListActivity, useListUsers } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import type { ActivityEvent, EventType } from '#/lib/types'

export const Route = createFileRoute('/atividade')({ component: Activity })

const filters: { type?: EventType; label: string }[] = [
  { label: 'Todos' },
  { type: 'UserCreated', label: 'Cadastros' },
  { type: 'WalletOpened', label: 'Aberturas' },
  { type: 'Deposit', label: 'Depósitos' },
  { type: 'Withdrawal', label: 'Saques' },
  { type: 'WalletClosed', label: 'Encerramentos' },
]

const dayKey = (iso: string) => new Date(iso).toDateString()

function dayLabel(iso: string) {
  const day = new Date(iso)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86_400_000)
  if (day.toDateString() === today.toDateString()) return 'Hoje'
  if (day.toDateString() === yesterday.toDateString()) return 'Ontem'
  return day.toLocaleDateString('pt-BR', { weekday: 'long' })
}

function Activity() {
  const activity = useListActivity({ query: { limit: 100 } })
  const users = useListUsers()
  const [filter, setFilter] = useState<EventType>()
  const names = new Map(users.data?.map((u) => [u.id, u.name]))

  const events = activity.data ?? []
  const visible = filter ? events.filter((e) => e.type === filter) : events
  const groups = new Map<string, ActivityEvent[]>()
  for (const e of visible) groups.set(dayKey(e.occurredAt), [...(groups.get(dayKey(e.occurredAt)) ?? []), e])

  return (
    <>
      <PageHeader
        title="Atividade"
        subtitle="Eventos publicados pelos serviços e consumidos pela Azure Function"
        actions={
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => activity.refetch()}
            disabled={activity.isFetching}
          >
            {activity.isFetching ? <Spinner /> : <Icon name="refresh" size="sm" />}
            Atualizar
          </button>
        }
      />
      <div className="content">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <fieldset className="flex flex-wrap gap-2" style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="sr-only">Filtrar por tipo de evento</legend>
            {filters.map((f) => (
              <button
                key={f.label}
                className={`chip ${filter === f.type ? 'on' : ''}`}
                type="button"
                aria-pressed={filter === f.type}
                onClick={() => setFilter(f.type)}
              >
                <Icon name={f.type ? eventMeta[f.type].icon : 'activity'} size="sm" />
                {f.label}
                <span className="num" style={{ opacity: 0.75 }}>
                  {f.type ? events.filter((e) => e.type === f.type).length : events.length}
                </span>
              </button>
            ))}
          </fieldset>
          <span className="src">
            <span className={`dot ${activity.isError ? 'dot-fail' : 'dot-ok'}`} />
            fn-notificacoes · consumidor de eventos
          </span>
        </div>

        {activity.isPending ? (
          <section className="card">
            <ListSkeleton rows={6} />
          </section>
        ) : activity.isError ? (
          <section className="card">
            <ErrorState
              description={apiErrorMessage(activity.error)}
              onRetry={() => activity.refetch()}
              retrying={activity.isFetching}
            />
          </section>
        ) : visible.length === 0 ? (
          <section className="card">
            <EmptyState
              illustration="events"
              title="Nenhum evento por aqui"
              description="Cadastros, depósitos e saques aparecem neste feed."
              action={
                filter && (
                  <button className="btn btn-secondary" type="button" onClick={() => setFilter(undefined)}>
                    Limpar filtro
                  </button>
                )
              }
            />
          </section>
        ) : (
          [...groups.values()].map((items) => (
            <section
              key={dayKey(items[0].occurredAt)}
              className="flex flex-col gap-2.5"
              aria-label={dayLabel(items[0].occurredAt)}
            >
              <h2 className="eyebrow flex items-center gap-2.5">
                {dayLabel(items[0].occurredAt)}
                <span className="num" style={{ fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>
                  {new Date(items[0].occurredAt).toLocaleDateString('pt-BR')}
                </span>
              </h2>
              <div className="card">
                {items.map((e) => (
                  <EventItem key={e.id} event={e} names={names} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  )
}
