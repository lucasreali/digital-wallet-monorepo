import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ConfirmDialog } from '#/components/ConfirmDialog'
import { MoneyDialog, OpenWalletDialog } from '#/components/forms'
import { Icon } from '#/components/Icon'
import { useToast } from '#/components/Toast'
import { useCloseWallet, useDeposit, useListUsers, useListWallets, useOpenWallet, useWithdraw } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import { brl } from '#/lib/format'
import type { User, Wallet } from '#/lib/types'

// Containers: generated mutation hooks + presentational dialogs. Every mutation refetches all queries on success.

/** "Abrir carteira" button + dialog. Pass `owner` to offer only that user (user detail page). */
export function OpenWalletButton({
  owner,
  className = 'btn btn-primary',
  label = 'Abrir carteira',
}: {
  owner?: User
  className?: string
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const toast = useToast()
  const users = useListUsers({ query: { enabled: open && !owner } })
  const wallets = useListWallets({}, { query: { enabled: open && !owner } })
  const owners = new Set(wallets.data?.map((w) => w.ownerId))
  const candidates = owner ? [owner] : (users.data ?? []).filter((u) => !owners.has(u.id))
  const names = new Map(candidates.map((u) => [u.id, u.name]))

  const openWallet = useOpenWallet({
    mutation: {
      onSuccess: (wallet) => {
        queryClient.invalidateQueries()
        setOpen(false)
        toast({
          title: 'Carteira aberta',
          description: `${names.get(wallet.ownerId) ?? 'O titular'} começa com R$ 0,00.`,
          tone: 'open',
          icon: 'wallet',
        })
      },
    },
  })

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          openWallet.reset()
          setOpen(true)
        }}
      >
        <Icon name="wallet" size="sm" />
        {label}
      </button>
      <OpenWalletDialog
        open={open}
        onClose={() => setOpen(false)}
        candidates={candidates}
        onSubmit={(ownerId) => openWallet.mutate({ body: { ownerId } })}
        pending={openWallet.isPending}
        error={apiErrorMessage(openWallet.error ?? users.error ?? wallets.error)}
      />
    </>
  )
}

/** Deposit or withdraw dialog; open while `kind` is set. */
export function MoneyAction({
  wallet,
  ownerName,
  kind,
  onClose,
}: {
  wallet: Wallet
  ownerName: string
  kind?: 'deposit' | 'withdraw'
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const onSuccess = (amount: number) => (saved: Wallet) => {
    queryClient.invalidateQueries()
    onClose()
    toast({
      title: `${kind === 'deposit' ? 'Depósito' : 'Saque'} de ${brl(amount)} realizado`,
      description: `Novo saldo de ${ownerName}: ${brl(saved.balance)}`,
      tone: kind === 'deposit' ? 'in' : 'out',
      icon: kind === 'deposit' ? 'deposit' : 'withdraw',
    })
  }
  const deposit = useDeposit({ mutation: { onSuccess: (saved, vars) => onSuccess(vars.body.amount)(saved) } })
  const withdraw = useWithdraw({ mutation: { onSuccess: (saved, vars) => onSuccess(vars.body.amount)(saved) } })
  const mutation = kind === 'withdraw' ? withdraw : deposit

  return (
    <MoneyDialog
      open={!!kind}
      kind={kind ?? 'deposit'}
      ownerName={ownerName}
      balance={wallet.balance}
      onClose={() => {
        deposit.reset()
        withdraw.reset()
        onClose()
      }}
      onSubmit={(amount) => mutation.mutate({ path: { id: wallet.id }, body: { amount } })}
      pending={mutation.isPending}
      error={apiErrorMessage(mutation.error)}
    />
  )
}

/** Close-wallet confirmation; open while `wallet` is set. Shows the API refusal (409 when the balance is not zero). */
export function CloseWalletDialog({
  wallet,
  ownerName,
  onClose,
  onClosed,
}: {
  wallet?: Wallet
  ownerName: string
  onClose: () => void
  onClosed?: () => void
}) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const close = useCloseWallet({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Carteira encerrada',
          description: `A carteira de ${ownerName} foi encerrada.`,
          tone: 'out',
          icon: 'xCircle',
        })
        onClose()
        onClosed?.()
        queryClient.invalidateQueries()
      },
    },
  })
  return (
    <ConfirmDialog
      open={!!wallet}
      onClose={() => {
        close.reset()
        onClose()
      }}
      onConfirm={() => wallet && close.mutate({ path: { id: wallet.id } })}
      title={`Encerrar a carteira de ${ownerName}?`}
      description="A carteira sai do serviço Carteira. Só é possível com saldo zerado."
      confirmLabel="Encerrar carteira"
      pendingLabel="Encerrando…"
      pending={close.isPending}
      error={apiErrorMessage(close.error)}
    />
  )
}
