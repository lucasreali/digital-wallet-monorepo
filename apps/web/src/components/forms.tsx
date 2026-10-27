import { useForm } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { AlertError, Dialog, DialogActions } from '#/components/Dialog'
import { Icon } from '#/components/Icon'
import { brl, initials, parseMoney } from '#/lib/format'
import type { User } from '#/lib/types'

/** First validation message of a field, shown once the field was touched (or a submit was attempted). */
function FieldError({ id, meta }: { id: string; meta: { isTouched: boolean; errors: unknown[] } }) {
  const first = meta.errors[0] as { message?: string } | string | undefined
  const message = typeof first === 'string' ? first : first?.message
  if (!meta.isTouched || !message) return null
  return <ErrorMsg id={id}>{message}</ErrorMsg>
}

const ErrorMsg = ({ id, children }: { id: string; children: string }) => (
  <span className="error-msg" id={id}>
    <Icon name="alertCircle" size="xs" />
    {children}
  </span>
)

const isConflict = (error?: string) => error?.startsWith('409')

// ---------------------------------------------------------------- user

const userSchema = z.object({
  name: z.string().trim().min(3, 'O nome precisa de pelo menos 3 caracteres'),
  email: z.email('Informe um e-mail válido'),
})

export type UserFormValues = z.infer<typeof userSchema>

type UserFormProps = {
  open: boolean
  onClose: () => void
  /** Present when editing: opens as a side sheet prefilled with the user */
  user?: User
  onSubmit: (values: UserFormValues) => void
  pending?: boolean
  /** API error text; a 409 is shown on the e-mail field */
  error?: string
}

/** Create (dialog) or edit (side sheet) a user, validated with Zod before sending. */
export function UserFormDialog({ open, onClose, user, onSubmit, pending, error }: UserFormProps) {
  const form = useForm({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
    validators: { onChange: userSchema },
    onSubmit: ({ value }) => onSubmit({ name: value.name.trim(), email: value.email.trim() }),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the dialog opens, not on refetches
  useEffect(() => {
    if (open) form.reset({ name: user?.name ?? '', email: user?.email ?? '' })
  }, [open])

  const conflict = isConflict(error)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      variant={user ? 'sheet' : 'dialog'}
      title={user ? 'Editar usuário' : 'Novo usuário'}
      description={user ? <span className="num">{user.id}</span> : 'O cadastro vai para o serviço Identidade.'}
      onSubmit={form.handleSubmit}
      footer={
        <DialogActions
          onCancel={onClose}
          label={user ? 'Salvar alterações' : 'Cadastrar usuário'}
          pendingLabel={user ? 'Salvando…' : 'Cadastrando…'}
          pending={pending}
        />
      }
    >
      <form.Field name="name">
        {(field) => (
          <div className="field">
            <label className="label" htmlFor="user-name">
              Nome{' '}
              <span className="req" aria-hidden="true">
                *
              </span>
            </label>
            <input
              className={`input ${field.state.meta.isTouched && field.state.meta.errors.length ? 'is-error' : ''}`}
              id="user-name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={pending}
              aria-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
              aria-describedby="user-name-error"
            />
            <FieldError id="user-name-error" meta={field.state.meta} />
          </div>
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => {
          const invalid = (field.state.meta.isTouched && field.state.meta.errors.length > 0) || conflict
          return (
            <div className="field">
              <label className="label" htmlFor="user-email">
                E-mail{' '}
                <span className="req" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className={`input ${invalid ? 'is-error' : ''}`}
                id="user-email"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={pending}
                aria-invalid={invalid}
                aria-describedby="user-email-error"
              />
              <FieldError id="user-email-error" meta={field.state.meta} />
              {conflict && error && <ErrorMsg id="user-email-error">{error}</ErrorMsg>}
            </div>
          )
        }}
      </form.Field>
      {pending && user && <span className="hint">Campos bloqueados enquanto a alteração é enviada.</span>}
      {!conflict && <AlertError title="Não foi possível salvar" message={error} />}
    </Dialog>
  )
}

// ---------------------------------------------------------------- open wallet

type OpenWalletProps = {
  open: boolean
  onClose: () => void
  /** Users that do not own a wallet yet */
  candidates: User[]
  onSubmit: (ownerId: string) => void
  pending?: boolean
  /** API error text; a 409 is shown on the owner field */
  error?: string
}

/** Pick the owner (searchable list) and open a wallet with R$ 0,00. */
export function OpenWalletDialog({ open, onClose, candidates, onSubmit, pending, error }: OpenWalletProps) {
  const [search, setSearch] = useState('')
  const form = useForm({
    defaultValues: { ownerId: '' },
    validators: { onSubmit: z.object({ ownerId: z.string().min(1, 'Escolha o titular') }) },
    onSubmit: ({ value }) => onSubmit(value.ownerId),
  })

  useEffect(() => {
    if (open) {
      form.reset({ ownerId: '' })
      setSearch('')
    }
  }, [open, form])

  const term = search.trim().toLowerCase()
  const matches = candidates.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(term))
  const conflict = isConflict(error)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Abrir carteira"
      description="Somente usuários que ainda não têm carteira."
      onSubmit={form.handleSubmit}
      footer={<DialogActions onCancel={onClose} label="Abrir carteira" pendingLabel="Abrindo…" pending={pending} />}
    >
      <form.Field name="ownerId">
        {(field) => (
          <div className="field">
            <label className="label" htmlFor="owner-search">
              Titular{' '}
              <span className="req" aria-hidden="true">
                *
              </span>
            </label>
            <div className="input-wrap">
              <Icon name="search" size="sm" />
              <input
                className={`input ${field.state.meta.errors.length || conflict ? 'is-error' : ''}`}
                id="owner-search"
                role="combobox"
                aria-expanded="true"
                aria-controls="owner-list"
                placeholder="Buscar por nome ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="listbox" id="owner-list" role="listbox" aria-label="Usuários sem carteira">
              {matches.length === 0 && (
                <span className="muted" style={{ padding: '8px 10px', fontSize: 13 }}>
                  {candidates.length ? 'Nenhum usuário encontrado.' : 'Todos os usuários já têm carteira.'}
                </span>
              )}
              {matches.slice(0, 6).map((u) => {
                const selected = field.state.value === u.id
                return (
                  <div
                    key={u.id}
                    className={`option ${selected ? 'on' : ''}`}
                    role="option"
                    aria-selected={selected}
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => field.handleChange(u.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault()
                        field.handleChange(u.id)
                      }
                    }}
                  >
                    <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                      {initials(u.name)}
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span style={{ fontWeight: 700 }}>{u.name}</span>
                      <span className="muted" style={{ fontSize: 12 }}>
                        {u.email}
                      </span>
                    </span>
                    {selected && <Icon name="check" size="sm" />}
                  </div>
                )
              })}
            </div>
            <FieldError id="owner-error" meta={{ isTouched: true, errors: field.state.meta.errors }} />
            {conflict && error && <ErrorMsg id="owner-error">{error}</ErrorMsg>}
          </div>
        )}
      </form.Field>
      <div className="alert alert-info">
        <Icon name="info" size="sm" />
        <span>
          {conflict ? (
            'A lista foi atualizada. Escolha outro titular.'
          ) : (
            <>
              Toda carteira começa com saldo de{' '}
              <span className="num" style={{ fontWeight: 600 }}>
                R$ 0,00
              </span>
              .
            </>
          )}
        </span>
      </div>
      {!conflict && <AlertError title="Não foi possível abrir a carteira" message={error} />}
    </Dialog>
  )
}

// ---------------------------------------------------------------- deposit / withdraw

type MoneyProps = {
  open: boolean
  onClose: () => void
  kind: 'deposit' | 'withdraw'
  ownerName: string
  balance: number
  onSubmit: (amount: number) => void
  pending?: boolean
  /** API error text (e.g. 422 insufficient funds), shown on the amount field */
  error?: string
}

/** Deposit or withdraw an amount in BRL; checks > 0, 2 decimals and, for withdrawals, the balance. */
export function MoneyDialog({ open, onClose, kind, ownerName, balance, onSubmit, pending, error }: MoneyProps) {
  const deposit = kind === 'deposit'
  const schema = z.object({
    amount: z
      .string()
      .refine((v) => parseMoney(v) > 0, 'Informe um valor maior que zero, com até 2 casas decimais')
      .refine((v) => deposit || !(parseMoney(v) > balance), 'Saldo insuficiente'),
  })
  const form = useForm({
    defaultValues: { amount: '' },
    validators: { onChange: schema },
    onSubmit: ({ value }) => onSubmit(parseMoney(value.amount)),
  })

  useEffect(() => {
    if (open) form.reset({ amount: '' })
  }, [open, form])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={deposit ? 'Depositar' : 'Sacar'}
      description={`Carteira de ${ownerName}`}
      icon={deposit ? { name: 'deposit', tone: 't-in' } : { name: 'withdraw', tone: 't-out' }}
      onSubmit={form.handleSubmit}
      footer={
        <form.Subscribe selector={(s) => s.values.amount}>
          {(amount) => {
            const value = parseMoney(amount)
            return (
              <DialogActions
                onCancel={onClose}
                label={`${deposit ? 'Depositar' : 'Sacar'}${value > 0 ? ` ${brl(value)}` : ''}`}
                pendingLabel={deposit ? 'Depositando…' : 'Sacando…'}
                pending={pending}
              />
            )
          }}
        </form.Subscribe>
      }
    >
      <div
        className="flex justify-between"
        style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-2)' }}
      >
        <span className="t2" style={{ fontWeight: 600 }}>
          {deposit ? 'Saldo atual' : 'Saldo disponível'}
        </span>
        <span className="num" style={{ fontWeight: 600 }}>
          {brl(balance)}
        </span>
      </div>
      <form.Field name="amount">
        {(field) => {
          const invalid = (field.state.meta.isTouched && field.state.meta.errors.length > 0) || !!error
          const value = parseMoney(field.state.value)
          return (
            <>
              <div className="field">
                <label className="label" htmlFor="amount">
                  Valor (R$){' '}
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="input-wrap">
                  <span className="prefix">R$</span>
                  <input
                    className={`input input-money ${invalid ? 'is-error' : ''}`}
                    id="amount"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={pending}
                    aria-invalid={invalid}
                    aria-describedby="amount-msg"
                  />
                </div>
                <FieldError id="amount-msg" meta={field.state.meta} />
                {error && <ErrorMsg id="amount-msg">{error}</ErrorMsg>}
                {!invalid && (
                  <span className="hint" id="amount-msg">
                    Maior que zero, com 2 casas decimais.
                  </span>
                )}
              </div>
              {deposit && value > 0 && (
                <div className="flex items-center justify-between">
                  <span className="muted" style={{ fontSize: 13 }}>
                    Saldo após o depósito
                  </span>
                  <span className="num in" style={{ fontWeight: 600 }}>
                    {brl(balance + value)}
                  </span>
                </div>
              )}
              {!deposit && balance > 0 && (
                <button
                  className="btn btn-ghost btn-sm self-start"
                  type="button"
                  style={{ color: 'var(--primary-text)' }}
                  onClick={() => field.handleChange(balance.toFixed(2).replace('.', ','))}
                >
                  Usar saldo total (<span className="num">{brl(balance)}</span>)
                </button>
              )}
            </>
          )
        }}
      </form.Field>
    </Dialog>
  )
}
