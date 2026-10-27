import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/')({ component: Page })

function Page() {
  return <PageHeader title="Painel" subtitle="Visão geral da carteira digital · GET /aggregated-data" />
}
