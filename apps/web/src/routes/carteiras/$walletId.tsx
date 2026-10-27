import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CopyButton } from '#/components/CopyButton'
import { Icon } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { EmptyState, ErrorState, ListSkeleton, Skeleton } from '#/components/states'
import { CloseWalletDialog, MoneyAction } from '#/features/wallets'
import { useGetUser, useGetWallet, useListTransactions } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { brl, dateTime, initials } from '#/lib/format'

export const Route = createFileRoute('/carteiras/$walletId')({ component: WalletDetail })

function WalletDetail() {
  const { walletId } = Route.useParams()
  const navigate = useNavigate()
  const wallet = useGetWallet({ path: { id: walletId } })
  const ownerId = wallet.data?.ownerId ?? ''
  const owner = useGetUser({ path: { id: ownerId } }, { query: { enabled: !!ownerId } })
  const transactions = useListTransactions({ path: { id: walletId } })
  const [money, setMoney] = useState<'deposit' | 'withdraw'>()
  const [closing, setClosing] = useState(false)

  const ownerName = owner.data?.name ?? 'Titular'
  const crumb = { to: '/carteiras', label: 'Carteiras', current: owner.data?.name ?? '…' }
  const canClose = wallet.data?.balance === 0

  if (wallet.isError) {
    return (
      <>
        <PageHeader title="Detalhe da carteira" crumb={crumb} />
        <div className="content">
          <section className="card">
            <ErrorState
              title={wallet.error.status === 404 ? 'Carteira não encontrada' : undefined}
              description={apiErrorMessage(wallet.error)}
              onRetry={() => wallet.refetch()}
              retrying={wallet.isFetching}
            />
          </section>
        </div>
      </>
    )
  }

  const moneyButtons = (lg?: boolean) => (
    <>
      <button
        className={`btn btn-primary ${lg ? 'btn-lg' : ''}`}
        type="button"
        disabled={!wallet.data}
        onClick={() => setMoney('deposit')}
      >
        <Icon name="deposit" size="sm" />
        Depositar
      </button>
      <button
        className={`btn btn-secondary ${lg ? 'btn-lg' : ''}`}
        type="button"
        disabled={!wallet.data}
        onClick={() => setMoney('withdraw')}
      >
        <Icon name="withdraw" size="sm" />
        Sacar
      </button>
    </>
  )

  return (
    <>
      <PageHeader title="Detalhe da carteira" crumb={crumb} actions={moneyButtons()} />
      <div className="content">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="flex min-w-0 flex-col gap-5" style={{ flex: '1 1 420px' }}>
            <section className="card flex flex-col gap-5" aria-labelledby="bh-l" style={{ padding: 28 }}>
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow" id="bh-l">
                  Saldo disponível
                </span>
                <span className="src">
                  <span className="dot dot-ok" />
                  svc-carteira · Azure SQL
                </span>
              </div>
              {wallet.isPending ? (
                <Skeleton width={260} height={56} />
              ) : (
                <span
                  className="num"
                  style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1 }}
                >
                  {brl(wallet.data.balance)}
                </span>
              )}
              <div className="grid grid-cols-2 gap-2.5">{moneyButtons(true)}</div>
              <div className="divider" />
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
                    Titular
                  </span>
                  {owner.data ? (
                    <Link
                      to="/usuarios/$userId"
                      params={{ userId: owner.data.id }}
                      className="flex items-center gap-2.5"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <span className="avatar" style={{ width: 30, height: 30, fontSize: 11.5 }}>
                        {initials(owner.data.name)}
                      </span>
                      <span className="flex flex-col items-end">
                        <span className="link">{owner.data.name}</span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          {owner.data.email}
                        </span>
                      </span>
                    </Link>
                  ) : owner.isError ? (
                    <span className="out" style={{ fontSize: 12.5 }}>
                      {apiErrorMessage(owner.error)}
                    </span>
                  ) : (
                    <Skeleton width={160} height={30} />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>
                    ID
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="num t2" style={{ fontSize: 12.5 }}>
                      {walletId}
                    </span>
                    <CopyButton value={walletId} label="Copiar id da carteira" />
                  </span>
                </div>
              </div>
            </section>
            <section className="card flex flex-col gap-3" aria-labelledby="enc" style={{ padding: '22px 24px' }}>
              <h2 className="h2" id="enc">
                Encerrar carteira
              </h2>
              <p className="t2" style={{ fontSize: 13.5 }}>
                Disponível apenas com saldo zerado. Saque todo o saldo antes de encerrar.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="muted flex items-center gap-1.5" style={{ fontSize: 12.5 }}>
                  <Icon name="lock" size="xs" />
                  Saldo atual: <span className="num">{wallet.data ? brl(wallet.data.balance) : '—'}</span>
                </span>
                <button
                  className="btn btn-danger-outline"
                  type="button"
                  disabled={!canClose}
                  aria-describedby="enc"
                  onClick={() => setClosing(true)}
                >
                  <Icon name="xCircle" size="sm" />
                  Encerrar carteira
                </button>
              </div>
            </section>
          </div>

          <section className="card min-w-0" aria-labelledby="tl" style={{ flex: '1.25 1 480px' }}>
            <div className="card-head">
              <div className="card-title">
                <h2 className="h2" id="tl">
                  Movimentações desta carteira
                </h2>
                <span className="src">svc-carteira</span>
              </div>
              {transactions.data && (
                <span className="muted" style={{ fontSize: 12.5 }}>
                  <span className="num">{transactions.data.length}</span> movimentações
                </span>
              )}
            </div>
            {transactions.isPending ? (
              <ListSkeleton rows={4} />
            ) : transactions.isError ? (
              <ErrorState
                description={apiErrorMessage(transactions.error)}
                onRetry={() => transactions.refetch()}
                retrying={transactions.isFetching}
              />
            ) : transactions.data.length === 0 ? (
              <EmptyState
                illustration="events"
                title="Nenhuma movimentação ainda"
                description="Depósitos e saques desta carteira aparecem aqui."
              />
            ) : (
              <ol style={{ listStyle: 'none', margin: 0, padding: '8px 24px 20px' }}>
                {transactions.data.map((t, i) => {
                  const isIn = t.type === 'deposit'
                  return (
                    <li key={t.id} className="grid gap-3.5" style={{ gridTemplateColumns: '40px minmax(0, 1fr) auto' }}>
                      <div className="flex flex-col items-center">
                        <span className={`ev-ic ${isIn ? 't-in' : 't-out'}`} style={{ marginTop: 14 }}>
                          <Icon name={isIn ? 'deposit' : 'withdraw'} />
                        </span>
                        {i < transactions.data.length - 1 && (
                          <span
                            style={{ flex: 1, width: 2, background: 'var(--border)', marginTop: 6, minHeight: 24 }}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5" style={{ padding: '16px 0' }}>
                        <span className="ev-title">{isIn ? 'Depósito' : 'Saque'}</span>
                        <span className="muted num" style={{ fontSize: 12.5 }}>
                          {dateTime(t.createdAt)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5" style={{ padding: '16px 0' }}>
                        <span className={`num ${isIn ? 'in' : 'out'}`} style={{ fontSize: 16, fontWeight: 600 }}>
                          {isIn ? '+ ' : '− '}
                          {brl(t.amount)}
                        </span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          saldo após <span className="num">{brl(t.balanceAfter)}</span>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>
      </div>
      {wallet.data && (
        <MoneyAction wallet={wallet.data} ownerName={ownerName} kind={money} onClose={() => setMoney(undefined)} />
      )}
      <CloseWalletDialog
        wallet={closing ? wallet.data : undefined}
        ownerName={ownerName}
        onClose={() => setClosing(false)}
        onClosed={() => navigate({ to: '/carteiras' })}
      />
    </>
  )
}
