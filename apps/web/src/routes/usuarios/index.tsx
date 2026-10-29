import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { columnHelper, DataTable } from '#/components/DataTable'
import { Icon } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { EmptyState, ErrorState, ListSkeleton } from '#/components/states'
import { Tip } from '#/components/Tip'
import { DeleteUserDialog, EditUserDialog, NewUserButton } from '#/features/users'
import { useListUsers, useListWallets } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { initials } from '#/lib/format'
import type { User } from '#/lib/types'

export const Route = createFileRoute('/usuarios/')({ component: Users })

type Row = User & { hasWallet: boolean }

const col = columnHelper<Row>()

function Users() {
  const users = useListUsers()
  const wallets = useListWallets()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<User>()
  const [deleting, setDeleting] = useState<User>()

  const owners = new Set(wallets.data?.map((w) => w.ownerId))
  const term = search.trim().toLowerCase()
  const rows: Row[] = (users.data ?? [])
    .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(term))
    .map((u) => ({ ...u, hasWallet: owners.has(u.id) }))

  const columns = [
    col.accessor('name', {
      header: 'Nome',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="who">
          <span className="avatar">{initials(row.original.name)}</span>
          <Link className="who-name" to="/usuarios/$userId" params={{ userId: row.original.id }}>
            {row.original.name}
          </Link>
        </div>
      ),
    }),
    col.accessor('email', { header: 'E-mail', cell: (info) => <span className="t2">{info.getValue()}</span> }),
    col.accessor('hasWallet', {
      header: 'Carteira',
      cell: (info) =>
        info.getValue() ? (
          <span className="badge b-success">
            <Icon name="wallet" size="xs" />
            Com carteira
          </span>
        ) : (
          <span className="badge b-neutral">
            <Icon name="minus" size="xs" />
            Sem carteira
          </span>
        ),
    }),
    col.display({
      id: 'actions',
      header: () => <span className="sr-only">Ações</span>,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="actions">
          <Tip label="Ver detalhes">
            <Link
              className="icon-btn"
              to="/usuarios/$userId"
              params={{ userId: row.original.id }}
              aria-label={`Ver ${row.original.name}`}
            >
              <Icon name="eye" />
            </Link>
          </Tip>
          <Tip label="Editar">
            <button
              className="icon-btn"
              type="button"
              aria-label={`Editar ${row.original.name}`}
              onClick={() => setEditing(row.original)}
            >
              <Icon name="pencil" />
            </button>
          </Tip>
          <Tip label="Excluir">
            <button
              className="icon-btn danger"
              type="button"
              aria-label={`Excluir ${row.original.name}`}
              onClick={() => setDeleting(row.original)}
            >
              <Icon name="trash" />
            </button>
          </Tip>
        </div>
      ),
    }),
  ]

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle="Cadastro de pessoas · dados do serviço Identidade (MongoDB)"
        actions={<NewUserButton />}
      />
      <div className="content">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="input-wrap" style={{ flex: '0 1 400px' }}>
            <Icon name="search" size="sm" />
            <label htmlFor="u-search" className="sr-only">
              Buscar usuários
            </label>
            <input
              className="input"
              id="u-search"
              type="search"
              placeholder="Buscar por nome ou e-mail"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2.5">
            {users.data && (
              <span className="t2" style={{ fontWeight: 700 }}>
                <span className="num">{users.data.length}</span> usuários
              </span>
            )}
            <span className="src">
              <span className={`dot ${users.isError ? 'dot-fail' : 'dot-ok'}`} />
              svc-identidade
            </span>
          </div>
        </div>
        {users.isPending ? (
          <section className="card">
            <ListSkeleton rows={6} />
          </section>
        ) : users.isError ? (
          <section className="card">
            <ErrorState
              description={apiErrorMessage(users.error)}
              onRetry={() => users.refetch()}
              retrying={users.isFetching}
            />
          </section>
        ) : users.data.length === 0 ? (
          <section className="card">
            <EmptyState
              illustration="users"
              title="Nenhum usuário ainda"
              description="Cadastre alguém para começar a operar."
              action={<NewUserButton label="Cadastrar o primeiro" />}
            />
          </section>
        ) : rows.length === 0 ? (
          <section className="card">
            <EmptyState
              illustration="users"
              title="Nenhum usuário encontrado"
              description={`Nada corresponde a “${search}”.`}
              action={
                <button className="btn btn-secondary" type="button" onClick={() => setSearch('')}>
                  Limpar busca
                </button>
              }
            />
          </section>
        ) : (
          <DataTable data={rows} columns={columns} label="Lista de usuários" />
        )}
      </div>
      <EditUserDialog user={editing} onClose={() => setEditing(undefined)} />
      <DeleteUserDialog user={deleting} onClose={() => setDeleting(undefined)} />
    </>
  )
}
