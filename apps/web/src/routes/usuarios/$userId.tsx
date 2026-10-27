import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/usuarios/$userId')({ component: Page })

function Page() {
  return <PageHeader title="Detalhe do usuário" subtitle="" />
}
