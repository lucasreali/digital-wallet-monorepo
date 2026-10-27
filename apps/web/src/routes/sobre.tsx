import { createFileRoute } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { Icon, type IconName } from '#/components/Icon'
import { PageHeader } from '#/components/layout/PageHeader'
import { swaggerUrls } from '#/lib/env'

export const Route = createFileRoute('/sobre')({ component: About })

type Box = { x: number; y: number; w: number; title: string; sub: string; icon?: IconName; style?: CSSProperties }

// Request flow diagram, positions taken from the prototype (1080 × 428 canvas)
const boxes: Box[] = [
  {
    x: 0,
    y: 178,
    w: 112,
    title: 'Usuário',
    sub: 'operador',
    style: { background: 'var(--surface-2)', justifyContent: 'center', textAlign: 'center' },
  },
  { x: 160, y: 178, w: 136, title: 'Frontend', sub: 'React SPA', icon: 'monitor' },
  { x: 344, y: 178, w: 136, title: 'API Gateway', sub: 'AWS', icon: 'shield' },
  {
    x: 528,
    y: 178,
    w: 120,
    title: 'BFF',
    sub: 'agregador',
    icon: 'layers',
    style: { background: 'var(--primary-soft)', border: '1.5px solid var(--primary)', color: 'var(--primary-text)' },
  },
  { x: 744, y: 24, w: 168, title: 'Identidade', sub: 'MongoDB', icon: 'users' },
  { x: 744, y: 178, w: 168, title: 'Carteira', sub: 'Azure SQL', icon: 'database' },
  { x: 744, y: 332, w: 168, title: 'Insights', sub: 'Azure Function', icon: 'zap' },
]

// [x1, y1, x2, y2, async event?, arrow head?]
const lines: [number, number, number, number, boolean, boolean][] = [
  [112, 214, 155, 214, false, true],
  [296, 214, 339, 214, false, true],
  [480, 214, 523, 214, false, true],
  [648, 214, 739, 214, false, true],
  [696, 60, 696, 368, false, false],
  [696, 60, 739, 60, false, true],
  [696, 368, 739, 368, false, true],
  [912, 60, 955, 60, true, true],
  [912, 214, 955, 214, true, true],
  [960, 368, 917, 368, true, true],
]

const components: { name: string; tech: string; role: string; swagger?: string }[] = [
  {
    name: 'Frontend',
    tech: 'React 19 · TanStack',
    role: 'SPA do painel de operação. Fala somente com o BFF, por hooks gerados do OpenAPI.',
  },
  {
    name: 'API Gateway',
    tech: 'AWS API Gateway',
    role: 'Porta de entrada pública: roteia as chamadas do frontend para o BFF.',
  },
  {
    name: 'BFF',
    tech: 'Backend for Frontend',
    role: 'Agrega Identidade, Carteira e Insights e expõe GET /aggregated-data para o painel.',
    swagger: swaggerUrls.bff,
  },
  {
    name: 'Identidade',
    tech: 'svc-identidade · MongoDB',
    role: 'Cadastro, edição e exclusão de usuários. Publica UserCreated.',
    swagger: swaggerUrls.identidade,
  },
  {
    name: 'Carteira',
    tech: 'svc-carteira · Azure SQL',
    role: 'Abre e encerra carteiras, registra depósitos e saques. Publica WalletOpened, Deposit, Withdrawal e WalletClosed.',
    swagger: swaggerUrls.carteira,
  },
  {
    name: 'Insights',
    tech: 'fn-notificacoes · Azure Function',
    role: 'Consome os eventos e calcula o score financeiro (0 a 1000).',
    swagger: swaggerUrls.insights,
  },
  {
    name: 'Barramento de eventos',
    tech: 'Azure Storage Queue',
    role: 'Transporta os eventos dos serviços até a Function e alimenta o feed de Atividade.',
  },
]

// Fill in with the group members before the delivery
const team = [1, 2, 3, 4].map((n) => ({ n, name: `[Nome do integrante ${n}]`, info: '[RA · papel]' }))

function About() {
  return (
    <>
      <PageHeader
        title="Sobre o sistema"
        subtitle="Arquitetura da carteira digital em nuvem"
        actions={
          swaggerUrls.bff && (
            <a className="btn btn-secondary" href={swaggerUrls.bff} target="_blank" rel="noreferrer">
              <Icon name="externalLink" size="sm" />
              Swagger do BFF
            </a>
          )
        }
      />
      <div className="content">
        <section className="card" aria-labelledby="flow">
          <div className="card-head">
            <h2 className="h2" id="flow">
              Fluxo de uma requisição
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="muted flex items-center gap-2" style={{ fontSize: 12.5 }}>
                <span style={{ width: 24, height: 2, background: 'var(--muted)' }} />
                requisição HTTP
              </span>
              <span className="muted flex items-center gap-2" style={{ fontSize: 12.5 }}>
                <span style={{ width: 24, borderTop: '2px dashed var(--muted)' }} />
                evento assíncrono
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto', padding: 24 }}>
            <div style={{ position: 'relative', width: 1080, height: 428 }}>
              <svg
                width="1080"
                height="428"
                style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
                role="img"
                aria-label="Usuário → Frontend → API Gateway → BFF → Identidade, Carteira e Insights; os serviços publicam eventos no barramento, que entrega à Function"
              >
                <defs>
                  {['muted', 'primary'].map((tone) => (
                    <marker
                      key={tone}
                      id={`arrow-${tone}`}
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path d="M0 0 L4 2 L0 4 Z" style={{ fill: `var(--${tone})` }} />
                    </marker>
                  ))}
                </defs>
                {lines.map(([x1, y1, x2, y2, async, head]) => (
                  <line
                    key={`${x1}-${y1}-${x2}-${y2}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray={async ? '6 6' : undefined}
                    style={{ stroke: async ? 'var(--primary)' : 'var(--muted)' }}
                    markerEnd={head ? `url(#arrow-${async ? 'primary' : 'muted'})` : undefined}
                  />
                ))}
              </svg>
              {boxes.map((b) => (
                <div
                  key={b.title}
                  style={{
                    position: 'absolute',
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: 72,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 12,
                    fontSize: 13,
                    lineHeight: 1.3,
                    ...b.style,
                  }}
                >
                  {b.icon && <Icon name={b.icon} />}
                  <span>
                    <b>{b.title}</b>
                    <br />
                    {b.sub}
                  </span>
                </div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: 960,
                  top: 24,
                  width: 112,
                  height: 380,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'var(--surface-2)',
                  border: '1.5px dashed var(--primary)',
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.35,
                  textAlign: 'center',
                }}
              >
                <Icon name="activity" />
                <span>
                  <b>Barramento de eventos</b>
                  <br />
                  <span className="muted">publica e entrega à Function</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3.5" aria-labelledby="comp">
          <h2 className="h2" id="comp">
            Componentes
          </h2>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))' }}
          >
            {components.map((c) => (
              <article key={c.name} className="card flex flex-col gap-3" style={{ padding: 20 }}>
                <div className="flex flex-col gap-1">
                  <h3 style={{ fontSize: 15, fontWeight: 800 }}>{c.name}</h3>
                  <span className="src self-start">{c.tech}</span>
                </div>
                <p className="t2 flex-1" style={{ fontSize: 13.5 }}>
                  {c.role}
                </p>
                {c.swagger && (
                  <a className="link" href={c.swagger} target="_blank" rel="noreferrer">
                    Abrir Swagger
                    <Icon name="externalLink" size="xs" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="card flex flex-col gap-4" aria-labelledby="team" style={{ padding: '22px 24px' }}>
          <h2 className="h2" id="team">
            Equipe
          </h2>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))' }}
          >
            {team.map((m) => (
              <div
                key={m.n}
                className="flex items-center gap-3"
                style={{ padding: 12, border: '1px dashed var(--border-strong)', borderRadius: 12 }}
              >
                <span className="avatar">{m.n}</span>
                <span className="flex flex-col">
                  <span style={{ fontWeight: 700 }}>{m.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {m.info}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
