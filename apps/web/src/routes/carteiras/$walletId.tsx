import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/carteiras/$walletId')({ component: Page })

function Page() {
  return <PageHeader title="Detalhe da carteira" subtitle="" />
}
