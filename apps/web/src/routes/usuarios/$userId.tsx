import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CopyButton } from '#/components/CopyButton'
import { Icon } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { ErrorState, Skeleton } from '#/components/states'
import { DeleteUserDialog, EditUserDialog } from '#/features/users'
import { OpenWalletButton } from '#/features/wallets'
import { useGetUser, useListWallets } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { brl, initials } from '#/lib/format'

export const Route = createFileRoute('/usuarios/$userId')({ component: UserDetail })

function UserDetail() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()
  const user = useGetUser({ path: { id: userId } })
  const wallets = useListWallets({ query: { ownerId: userId } })
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const wallet = wallets.data?.[0]

  const crumb = { to: '/usuarios', label: 'Usuários', current: user.data?.name ?? '…' }

  if (user.isError) {
    return (
      <>
        <PageHeader title="Detalhe do usuário" crumb={crumb} />
        <div className="content">
          <section className="card">
            <ErrorState
              title={user.error.status === 404 ? 'Usuário não encontrado' : undefined}
              description={apiErrorMessage(user.error)}
              onRetry={() => user.refetch()}
              retrying={user.isFetching}
            />
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Detalhe do usuário"
        crumb={crumb}
        actions={
          user.data && (
            <>
              <button className="btn btn-secondary" type="button" onClick={() => setEditing(true)}>
                <Icon name="pencil" size="sm" />
                Editar
              </button>
              <button className="btn btn-danger-outline" type="button" onClick={() => setDeleting(true)}>
                <Icon name="trash" size="sm" />
                Excluir
              </button>
            </>
          )
        }
      />
      <div className="content">
        <section
          className="card flex flex-wrap items-center gap-6"
          aria-label="Dados do usuário"
          aria-busy={user.isPending}
          style={{ padding: 28 }}
        >
          {user.isPending ? (
            <>
              <Skeleton width={64} height={64} radius={32} />
              <span className="flex flex-1 flex-col gap-2">
                <Skeleton width={200} height={26} />
                <Skeleton width={240} height={14} />
              </span>
            </>
          ) : (
            <>
              <span className="avatar avatar-lg">{initials(user.data.name)}</span>
              <div className="flex flex-1 flex-col gap-1.5" style={{ minWidth: 260 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{user.data.name}</h2>
                <span className="t2 flex items-center gap-2">
                  <Icon name="mail" size="sm" />
                  {user.data.email}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="src">
                  <span className="dot dot-ok" />
                  svc-identidade · MongoDB
                </span>
                <div
                  className="flex items-center gap-1"
                  style={{
                    padding: '4px 4px 4px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    background: 'var(--surface-2)',
                  }}
                >
                  <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
                    ID
                  </span>
                  <span className="num" style={{ fontSize: 13 }}>
                    {user.data.id}
                  </span>
                  <CopyButton value={user.data.id} label="Copiar id do usuário" />
                </div>
              </div>
            </>
          )}
        </section>

        <div className="row">
          <section className="card flex flex-col" aria-labelledby="ud-w" style={{ flex: '1 1 460px' }}>
            <div className="card-head">
              <div className="card-title">
                <Icon name="wallet" />
                <h2 className="h2" id="ud-w">
                  Carteira
                </h2>
              </div>
              <span className="src">
                <span className={`dot ${wallets.isError ? 'dot-fail' : 'dot-ok'}`} />
                svc-carteira · Azure SQL
              </span>
            </div>
            {wallets.isPending ? (
              <div className="flex flex-col gap-3" style={{ padding: 24 }}>
                <Skeleton width={120} height={12} />
                <Skeleton width={240} height={40} />
              </div>
            ) : wallets.isError ? (
              <ErrorState
                description={apiErrorMessage(wallets.error)}
                onRetry={() => wallets.refetch()}
                retrying={wallets.isFetching}
              />
            ) : wallet ? (
              <div className="flex flex-col gap-4" style={{ padding: 24 }}>
                <div className="flex flex-col gap-1">
                  <span className="eyebrow">Saldo disponível</span>
                  <span
                    className="num"
                    style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1 }}
                  >
                    {brl(wallet.balance)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>
                    ID da carteira
                  </span>
                  <span className="num t2" style={{ fontSize: 12.5 }}>
                    {wallet.id}
                  </span>
                </div>
                <div className="divider" />
                <Link
                  className="btn btn-secondary btn-sm self-end"
                  to="/carteiras/$walletId"
                  params={{ walletId: wallet.id }}
                >
                  Ver carteira
                  <Icon name="arrowRight" size="sm" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center" style={{ padding: '28px 20px' }}>
                <span className="h2">{user.data?.name.split(' ')[0] ?? 'Este usuário'} ainda não tem carteira</span>
                <span className="muted" style={{ fontSize: 13.5 }}>
                  Toda carteira começa com saldo de <span className="num">R$ 0,00</span>.
                </span>
                {user.data && <OpenWalletButton owner={user.data} />}
              </div>
            )}
          </section>

          <section
            className="card flex flex-col gap-3 self-start"
            aria-labelledby="ud-z"
            style={{ flex: '1 1 340px', padding: 24 }}
          >
            <h2 className="h2" id="ud-z">
              Excluir usuário
            </h2>
            <p className="t2" style={{ fontSize: 13.5 }}>
              Remove o cadastro do serviço Identidade. A API recusa a exclusão enquanto o usuário tiver carteira.
            </p>
            {wallet && user.data && (
              <div className="alert alert-warning">
                <Icon name="alertTriangle" size="sm" />
                <span>
                  {user.data.name} tem uma carteira com{' '}
                  <span className="num" style={{ fontWeight: 600 }}>
                    {brl(wallet.balance)}
                  </span>
                  .
                </span>
              </div>
            )}
            <button
              className="btn btn-danger-outline self-start"
              type="button"
              disabled={!user.data}
              onClick={() => setDeleting(true)}
            >
              <Icon name="trash" size="sm" />
              Excluir usuário
            </button>
          </section>
        </div>
      </div>
      <EditUserDialog user={editing ? user.data : undefined} onClose={() => setEditing(false)} />
      <DeleteUserDialog
        user={deleting ? user.data : undefined}
        onClose={() => setDeleting(false)}
        onDeleted={() => navigate({ to: '/usuarios' })}
      />
    </>
  )
}
