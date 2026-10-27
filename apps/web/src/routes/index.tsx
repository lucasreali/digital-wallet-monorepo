import { createFileRoute, Link } from '@tanstack/react-router'
import { EventItem } from '#/components/EventItem'
import { Icon, type IconName } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { ScoreGauge, scoreBand } from '#/components/ScoreGauge'
import { EmptyState, ErrorState, ListSkeleton, Skeleton, Spinner } from '#/components/states'
import { NewUserButton } from '#/features/users'
import { OpenWalletButton } from '#/features/wallets'
import { useGetAggregatedData, useListActivity } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { brl, initials, relativeTime } from '#/lib/format'

export const Route = createFileRoute('/')({ component: Dashboard })

function Dashboard() {
  // One BFF call that aggregates MongoDB (users), Azure SQL (wallets) and the Function (insights)
  const aggregated = useGetAggregatedData()
  const activity = useListActivity({ query: { limit: 5 } })
  const data = aggregated.data

  const owners = new Set(data?.wallets.map((w) => w.ownerId))
  const names = new Map(data?.users.map((u) => [u.id, u.name]))
  const total = data?.wallets.reduce((sum, w) => sum + w.balance, 0) ?? 0
  const top = [...(data?.wallets ?? [])].sort((a, b) => b.balance - a.balance).slice(0, 5)
  const latestUsers = [...(data?.users ?? [])].reverse().slice(0, 5)

  const sources: { name: string; tech: string; icon: IconName; ok: boolean }[] = [
    { name: 'Identidade', tech: 'MongoDB', icon: 'users', ok: !!data },
    { name: 'Carteira', tech: 'Azure SQL', icon: 'database', ok: !!data },
    { name: 'Insights', tech: 'Azure Function', icon: 'zap', ok: !!data },
    { name: 'Eventos', tech: 'Storage Queue', icon: 'activity', ok: !!activity.data },
  ]
  const refreshing = aggregated.isFetching || activity.isFetching

  return (
    <>
      <PageHeader
        title="Painel"
        subtitle={
          <>
            Visão geral da carteira digital · <span className="num">GET /aggregated-data</span>
          </>
        }
        actions={
          <>
            <OpenWalletButton className="btn btn-secondary" />
            <NewUserButton />
          </>
        }
      />
      <div className="content">
        <section className="card flex flex-col gap-3.5" aria-labelledby="ds-title" style={{ padding: '16px 20px' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="eyebrow" id="ds-title">
                Origem dos dados
              </h2>
              <span className="src">BFF agrega 4 fontes</span>
            </div>
            <div className="flex items-center gap-1.5">
              {aggregated.dataUpdatedAt > 0 && (
                <span className="muted" style={{ fontSize: 12.5 }}>
                  Atualizado {relativeTime(new Date(aggregated.dataUpdatedAt).toISOString())}
                </span>
              )}
              <button
                className="icon-btn"
                type="button"
                aria-label="Atualizar dados"
                disabled={refreshing}
                onClick={() => {
                  aggregated.refetch()
                  activity.refetch()
                }}
              >
                {refreshing ? <Spinner /> : <Icon name="refresh" size="sm" />}
              </button>
            </div>
          </div>
          <div className="auto-4" style={{ gap: 10 }}>
            {sources.map((s) => {
              const pending = s.name === 'Eventos' ? activity.isPending : aggregated.isPending
              return (
                <div key={s.name} className={`ds ${!pending && !s.ok ? 'fail' : ''}`}>
                  <span className="ds-ic">
                    <Icon name={s.icon} />
                  </span>
                  <span className="flex flex-col">
                    <span className="ds-name">{s.name}</span>
                    <span className="ds-tech">{s.tech}</span>
                  </span>
                  {pending ? (
                    <span className="ds-status">
                      <Skeleton width={56} height={10} />
                    </span>
                  ) : (
                    <span className="ds-status">
                      <Icon name={s.ok ? 'checkCircle' : 'xCircle'} size="sm" />
                      {s.ok ? 'Online' : 'Indisponível'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {aggregated.isError ? (
          <section className="card">
            <ErrorState
              description={apiErrorMessage(aggregated.error)}
              onRetry={() => aggregated.refetch()}
              retrying={aggregated.isFetching}
            />
          </section>
        ) : (
          <section className="auto-4" aria-label="Indicadores">
            <Stat
              label="Usuários cadastrados"
              icon="users"
              value={data?.users.length}
              meta={data && `${data.users.filter((u) => !owners.has(u.id)).length} sem carteira`}
              source="svc-identidade"
            />
            <Stat
              label="Carteiras abertas"
              icon="wallet"
              value={data?.wallets.length}
              meta={
                data?.users.length ? `${Math.round((data.wallets.length / data.users.length) * 100)}% dos usuários` : ''
              }
              source="svc-carteira"
            />
            <Stat
              label="Saldo total sob custódia"
              icon="banknote"
              value={data && brl(total)}
              meta={data && `Soma de ${data.wallets.length} carteiras`}
              source="svc-carteira"
            />
            <Stat
              label="Score financeiro"
              icon="gauge"
              value={
                data && (
                  <>
                    {data.insights.score}
                    <span className="muted" style={{ fontSize: 16, fontWeight: 500 }}>
                      {' '}
                      / 1000
                    </span>
                  </>
                )
              }
              meta={
                data && (
                  <span
                    className={`badge ${scoreBand(data.insights.score).badge}`}
                    style={{ height: 22, fontSize: 12 }}
                  >
                    {scoreBand(data.insights.score).label}
                  </span>
                )
              }
              source="fn-notificacoes"
            />
          </section>
        )}

        <div className="row">
          <section className="card flex flex-col" aria-labelledby="sc-title" style={{ flex: '1 1 360px' }}>
            <div className="card-head">
              <h2 className="h2" id="sc-title">
                Score financeiro
              </h2>
              <span className="src">
                <span className={`dot ${aggregated.isError ? 'dot-fail' : 'dot-ok'}`} />
                Insights · Azure Function
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center" style={{ padding: '24px 28px 28px' }}>
              {data ? (
                <ScoreGauge score={data.insights.score} generatedAt={data.insights.generatedAt} />
              ) : aggregated.isError ? (
                <ErrorState description="O score vem da Azure Function, pelo BFF." />
              ) : (
                <div className="flex w-full flex-col items-center gap-4" aria-busy="true">
                  <Skeleton width={260} height={130} radius={130} />
                  <Skeleton width={120} height={26} radius={99} />
                  <Skeleton width="100%" height={8} radius={4} />
                </div>
              )}
            </div>
          </section>

          <section className="card flex flex-col" aria-labelledby="ra-title" style={{ flex: '1.6 1 520px' }}>
            <div className="card-head">
              <div className="card-title">
                <h2 className="h2" id="ra-title">
                  Atividade recente
                </h2>
                <span className="src">Eventos</span>
              </div>
              <Link className="link" to="/atividade">
                Ver tudo
                <Icon name="arrowRight" size="xs" />
              </Link>
            </div>
            {activity.isPending ? (
              <ListSkeleton rows={4} />
            ) : activity.isError ? (
              <ErrorState
                description={apiErrorMessage(activity.error)}
                onRetry={() => activity.refetch()}
                retrying={activity.isFetching}
              />
            ) : activity.data.length === 0 ? (
              <EmptyState
                illustration="events"
                title="Nenhum evento por aqui"
                description="Cadastros, depósitos e saques aparecem neste feed."
              />
            ) : (
              <div>
                {activity.data.map((e) => (
                  <EventItem key={e.id} event={e} names={names} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="row">
          <section className="card" aria-labelledby="lu-title" style={{ flex: '1 1 420px' }}>
            <div className="card-head">
              <div className="card-title">
                <h2 className="h2" id="lu-title">
                  Últimos usuários
                </h2>
                <span className="src">svc-identidade</span>
              </div>
              <Link className="link" to="/usuarios">
                Ver todos
                <Icon name="arrowRight" size="xs" />
              </Link>
            </div>
            {!data ? (
              aggregated.isError ? null : (
                <ListSkeleton rows={3} />
              )
            ) : latestUsers.length === 0 ? (
              <EmptyState
                illustration="users"
                title="Nenhum usuário ainda"
                description="Cadastre alguém para começar a operar."
                action={<NewUserButton label="Cadastrar o primeiro" />}
              />
            ) : (
              latestUsers.map((u) => (
                <Link
                  key={u.id}
                  className="m-card-row"
                  to="/usuarios/$userId"
                  params={{ userId: u.id }}
                  style={{ padding: '12px 20px' }}
                >
                  <span className="avatar">{initials(u.name)}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span style={{ fontWeight: 700 }}>{u.name}</span>
                    <span className="muted" style={{ fontSize: 13 }}>
                      {u.email}
                    </span>
                  </span>
                  <Icon name="chevronRight" size="sm" className="muted" />
                </Link>
              ))
            )}
          </section>
          <section className="card" aria-labelledby="ms-title" style={{ flex: '1 1 420px' }}>
            <div className="card-head">
              <div className="card-title">
                <h2 className="h2" id="ms-title">
                  Maiores saldos
                </h2>
                <span className="src">svc-carteira</span>
              </div>
              <Link className="link" to="/carteiras">
                Ver todas
                <Icon name="arrowRight" size="xs" />
              </Link>
            </div>
            {!data ? (
              aggregated.isError ? null : (
                <ListSkeleton rows={3} />
              )
            ) : top.length === 0 ? (
              <EmptyState
                illustration="wallets"
                title="Nenhuma carteira aberta"
                description={
                  <>
                    Toda carteira começa com <span className="num">R$ 0,00</span>.
                  </>
                }
                action={<OpenWalletButton label="Abrir a primeira" />}
              />
            ) : (
              top.map((w, i) => (
                <Link
                  key={w.id}
                  className="m-card-row"
                  to="/carteiras/$walletId"
                  params={{ walletId: w.id }}
                  style={{ padding: '12px 20px' }}
                >
                  <span className="num muted" style={{ width: 20, fontWeight: 600 }}>
                    {i + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span style={{ fontWeight: 700 }}>{names.get(w.ownerId) ?? 'Titular não encontrado'}</span>
                    <span className="block" style={{ height: 4, borderRadius: 2, background: 'var(--surface-2)' }}>
                      <span
                        className="block"
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: 'var(--primary)',
                          width: `${top[0].balance ? Math.round((w.balance / top[0].balance) * 100) : 0}%`,
                        }}
                      />
                    </span>
                  </span>
                  <span className="num" style={{ fontSize: 15, fontWeight: 600, minWidth: 120, textAlign: 'right' }}>
                    {brl(w.balance)}
                  </span>
                </Link>
              ))
            )}
          </section>
        </div>
      </div>
    </>
  )
}

type StatProps = {
  label: string
  icon: IconName
  value: React.ReactNode
  meta: React.ReactNode
  source: string
}

function Stat({ label, icon, value, meta, source }: StatProps) {
  return (
    <div className="card stat">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-ic">
          <Icon name={icon} />
        </span>
      </div>
      {value === undefined ? <Skeleton width={90} height={30} /> : <span className="stat-value">{value}</span>}
      <div className="flex items-center justify-between gap-2">
        <span className="stat-meta">{meta}</span>
        <span className="src">{source}</span>
      </div>
    </div>
  )
}
