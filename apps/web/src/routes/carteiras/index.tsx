import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { columnHelper, DataTable } from '#/components/DataTable'
import { Icon } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { EmptyState, ErrorState, ListSkeleton } from '#/components/states'
import { CloseWalletDialog, OpenWalletButton } from '#/features/wallets'
import { useListUsers, useListWallets } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { brl, initials } from '#/lib/format'
import type { Wallet } from '#/lib/types'

export const Route = createFileRoute('/carteiras/')({ component: Wallets })

type Row = Wallet & { name: string; email: string }

const col = columnHelper<Row>()

function Wallets() {
  const wallets = useListWallets()
  const users = useListUsers()
  const [closing, setClosing] = useState<Row>()

  const byId = new Map(users.data?.map((u) => [u.id, u]))
  const rows: Row[] = (wallets.data ?? []).map((w) => ({
    ...w,
    name: byId.get(w.ownerId)?.name ?? 'Titular não encontrado',
    email: byId.get(w.ownerId)?.email ?? w.ownerId,
  }))
  const total = rows.reduce((sum, w) => sum + w.balance, 0)
  const withoutWallet = users.data ? users.data.length - new Set(rows.map((w) => w.ownerId)).size : undefined

  const columns = [
    col.accessor('name', {
      header: 'Titular',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="who">
          <span className="avatar">{initials(row.original.name)}</span>
          <span className="flex min-w-0 flex-col">
            <Link className="who-name" to="/carteiras/$walletId" params={{ walletId: row.original.id }}>
              {row.original.name}
            </Link>
            <span className="who-mail">{row.original.email}</span>
          </span>
        </div>
      ),
    }),
    col.accessor('balance', {
      header: 'Saldo',
      enableSorting: true,
      meta: { align: 'right' },
      cell: (info) => (
        <span className={`num ${info.getValue() === 0 ? 'muted' : ''}`} style={{ fontSize: 15, fontWeight: 600 }}>
          {brl(info.getValue())}
        </span>
      ),
    }),
    col.display({
      id: 'actions',
      header: () => <span className="sr-only">Ações</span>,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const zero = row.original.balance === 0
        return (
          <div className="actions">
            <Link
              className="icon-btn"
              to="/carteiras/$walletId"
              params={{ walletId: row.original.id }}
              aria-label={`Ver carteira de ${row.original.name}`}
            >
              <Icon name="eye" />
            </Link>
            <button
              className={`icon-btn ${zero ? 'danger' : ''}`}
              type="button"
              disabled={!zero}
              title={zero ? undefined : 'Zere o saldo para encerrar'}
              aria-label={
                zero
                  ? `Encerrar carteira de ${row.original.name}`
                  : `Encerrar indisponível: zere o saldo de ${row.original.name} antes`
              }
              onClick={() => setClosing(row.original)}
            >
              <Icon name={zero ? 'xCircle' : 'lock'} />
            </button>
          </div>
        )
      },
    }),
  ]

  return (
    <>
      <PageHeader
        title="Carteiras"
        subtitle="Saldos sob custódia · dados do serviço Carteira (Azure SQL)"
        actions={<OpenWalletButton />}
      />
      <div className="content">
        <section
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))' }}
          aria-label="Resumo"
        >
          <div className="card stat">
            <div className="stat-top">
              <span className="stat-label">Total de carteiras</span>
              <span className="src">svc-carteira</span>
            </div>
            <span className="stat-value">{wallets.data ? rows.length : '—'}</span>
          </div>
          <div className="card stat">
            <div className="stat-top">
              <span className="stat-label">Saldo somado</span>
              <span className="src">svc-carteira</span>
            </div>
            <span className="stat-value">{wallets.data ? brl(total) : '—'}</span>
          </div>
          <div className="card stat">
            <div className="stat-top">
              <span className="stat-label">Usuários sem carteira</span>
              <span className="src">svc-identidade</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="stat-value">{withoutWallet ?? '—'}</span>
              {!!withoutWallet && <OpenWalletButton className="link" label="Abrir para alguém" />}
            </div>
          </div>
        </section>
        {wallets.isPending ? (
          <section className="card">
            <ListSkeleton rows={5} />
          </section>
        ) : wallets.isError ? (
          <section className="card">
            <ErrorState
              description={apiErrorMessage(wallets.error)}
              onRetry={() => wallets.refetch()}
              retrying={wallets.isFetching}
            />
          </section>
        ) : rows.length === 0 ? (
          <section className="card">
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
          </section>
        ) : (
          <DataTable
            data={rows}
            columns={columns}
            label="Lista de carteiras"
            initialSorting={[{ id: 'balance', desc: true }]}
          />
        )}
        <p className="hint flex items-center gap-1.5">
          <Icon name="info" size="xs" />
          Só é possível encerrar carteiras com saldo zerado.
        </p>
      </div>
      <CloseWalletDialog wallet={closing} ownerName={closing?.name ?? ''} onClose={() => setClosing(undefined)} />
    </>
  )
}
