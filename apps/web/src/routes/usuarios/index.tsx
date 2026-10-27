import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'

export const Route = createFileRoute('/usuarios/')({ component: Page })

function Page() {
  return <PageHeader title="Usuários" subtitle="Cadastro de pessoas · dados do serviço Identidade (MongoDB)" />
}
