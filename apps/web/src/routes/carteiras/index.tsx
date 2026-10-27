import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/carteiras/')({ component: Page })

function Page() {
  return <PageHeader title="Carteiras" subtitle="Saldos sob custódia · dados do serviço Carteira (Azure SQL)" />
}
