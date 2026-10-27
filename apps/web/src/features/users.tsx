import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ConfirmDialog } from '#/components/ConfirmDialog'
import { UserFormDialog } from '#/components/forms'
import { Icon } from '#/components/Icon'
import { useToast } from '#/components/Toast'
import { useCreateUser, useDeleteUser, useUpdateUser } from '#/gen/hooks'
import { apiErrorMessage } from '#/lib/api-error'
import type { User } from '#/lib/types'

// Containers: generated mutation hooks + presentational dialogs. Every mutation refetches all queries on success.

export function NewUserButton({ className = 'btn btn-primary', label = 'Novo usuário' }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const toast = useToast()
  const create = useCreateUser({
    mutation: {
      onSuccess: (user) => {
        queryClient.invalidateQueries()
        setOpen(false)
        toast({ title: 'Usuário cadastrado', description: `${user.name} já aparece na lista.` })
      },
    },
  })
  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          create.reset()
          setOpen(true)
        }}
      >
        <Icon name="plus" size="sm" />
        {label}
      </button>
      <UserFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(body) => create.mutate({ body })}
        pending={create.isPending}
        error={apiErrorMessage(create.error)}
      />
    </>
  )
}

/** Edit side sheet; open while `user` is set. */
export function EditUserDialog({ user, onClose }: { user?: User; onClose: () => void }) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const update = useUpdateUser({
    mutation: {
      onSuccess: (saved) => {
        queryClient.invalidateQueries()
        onClose()
        toast({ title: 'Usuário atualizado', description: `${saved.name} · ${saved.email}` })
      },
    },
  })
  return (
    <UserFormDialog
      open={!!user}
      user={user}
      onClose={() => {
        update.reset()
        onClose()
      }}
      onSubmit={(body) => user && update.mutate({ path: { id: user.id }, body })}
      pending={update.isPending}
      error={apiErrorMessage(update.error)}
    />
  )
}

/** Delete confirmation (type the name); shows the API refusal, e.g. 409 while the user owns a wallet. */
export function DeleteUserDialog({
  user,
  onClose,
  onDeleted,
}: {
  user?: User
  onClose: () => void
  onDeleted?: () => void
}) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const remove = useDeleteUser({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Usuário excluído',
          description: `${user?.name} saiu do serviço Identidade.`,
          tone: 'out',
          icon: 'trash',
        })
        onClose()
        onDeleted?.()
        queryClient.invalidateQueries()
      },
    },
  })
  return (
    <ConfirmDialog
      open={!!user}
      onClose={() => {
        remove.reset()
        onClose()
      }}
      onConfirm={() => user && remove.mutate({ path: { id: user.id } })}
      title={`Excluir ${user?.name ?? ''}?`}
      description="O cadastro sai do serviço Identidade. Essa ação não pode ser desfeita."
      confirmText={user?.name}
      confirmLabel="Excluir usuário"
      pendingLabel="Excluindo…"
      pending={remove.isPending}
      error={apiErrorMessage(remove.error)}
    />
  )
}
