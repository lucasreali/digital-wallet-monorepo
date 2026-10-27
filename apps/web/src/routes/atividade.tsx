import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/atividade')({ component: Page })

function Page() {
  return <PageHeader title="Atividade" subtitle="Eventos publicados pelos serviços e consumidos pela Azure Function" />
}
