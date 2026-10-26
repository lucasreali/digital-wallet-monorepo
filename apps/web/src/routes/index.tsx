import { createFileRoute } from '@tanstack/react-router'
import { useGetAggregatedData } from '#/gen/hooks'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  // Busca no navegador: o front só fala com o BFF (via API Gateway em produção)
  const { data, isPending, error } = useGetAggregatedData()

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Carteira Digital</h1>
      {isPending && <p className="mt-4">Carregando…</p>}
      {error && <p className="mt-4 text-red-600">Erro ao falar com o BFF: {error.message}</p>}
      {data && (
        <section className="mt-6 grid gap-4">
          <Card title="Usuários (MongoDB)" value={data.users} />
          <Card title="Carteiras (Azure SQL)" value={data.wallets} />
          <Card title="Insights (Azure Function)" value={data.insights} />
        </section>
      )}
    </main>
  )
}

function Card({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">{title}</h2>
      <pre className="mt-2 overflow-x-auto text-sm">{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}
