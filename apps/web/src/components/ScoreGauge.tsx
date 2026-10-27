import { Icon } from '#/components/Icon'
import { dateTime } from '#/lib/format'

const bands = [
  { label: 'Baixo', range: '0–300', max: 300, color: 'var(--danger)', badge: 'b-danger', fr: 3 },
  { label: 'Regular', range: '301–500', max: 500, color: 'var(--warning)', badge: 'b-warning', fr: 2 },
  { label: 'Bom', range: '501–700', max: 700, color: 'var(--info)', badge: 'b-info', fr: 2 },
  { label: 'Excelente', range: '701–1000', max: 1000, color: 'var(--success)', badge: 'b-success', fr: 3 },
]

export const scoreBand = (score: number) => bands.find((b) => score <= b.max) ?? bands[3]

const ARC = Math.PI * 100 // half circle, r = 100

/** Financial score (0..1000) from the Insights Function: half-circle gauge, band badge and band scale. */
export function ScoreGauge({ score, generatedAt }: { score: number; generatedAt?: string }) {
  const value = Math.min(1000, Math.max(0, score))
  const band = scoreBand(value)
  const angle = Math.PI * (1 - value / 1000)
  const columns = bands.map((b) => `${b.fr}fr`).join(' ')

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div style={{ position: 'relative', width: 260, height: 150 }}>
        <svg
          width="260"
          height="150"
          viewBox="0 0 260 150"
          role="img"
          aria-label={`Score ${value} de 1000, faixa ${band.label}`}
        >
          <path
            d="M 30 130 A 100 100 0 0 1 230 130"
            style={{ fill: 'none', stroke: 'var(--surface-2)', strokeWidth: 18, strokeLinecap: 'round' }}
          />
          <path
            d="M 30 130 A 100 100 0 0 1 230 130"
            style={{
              fill: 'none',
              stroke: 'var(--primary)',
              strokeWidth: 18,
              strokeLinecap: 'round',
              strokeDasharray: `${(value / 1000) * ARC} 400`,
            }}
          />
          <circle
            cx={130 + 100 * Math.cos(angle)}
            cy={130 - 100 * Math.sin(angle)}
            r="10"
            style={{ fill: 'var(--surface)', stroke: 'var(--primary)', strokeWidth: 4 }}
          />
        </svg>
        <div className="absolute right-0 left-0 flex flex-col items-center" style={{ bottom: 4 }}>
          <span className="num" style={{ fontSize: 54, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {value}
          </span>
          <span className="num muted" style={{ fontSize: 12.5 }}>
            de 1000
          </span>
        </div>
      </div>
      <span className={`badge ${band.badge}`} style={{ height: 30, fontSize: 14, padding: '0 14px' }}>
        <Icon name="check" size="sm" />
        Faixa {band.label}
      </span>
      <div className="flex w-full flex-col gap-2">
        <div className="relative grid gap-1" style={{ gridTemplateColumns: columns, paddingTop: 10 }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: `calc(${value / 10}% - 6px)`,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid var(--text)',
            }}
          />
          {bands.map((b) => (
            <span
              key={b.label}
              style={{ height: 8, borderRadius: 4, background: b.color, opacity: b === band ? 1 : 0.28 }}
            />
          ))}
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: columns, fontSize: 12, lineHeight: 1.35 }}>
          {bands.map((b) => (
            <span
              key={b.label}
              className={b === band ? '' : 'muted'}
              style={b === band ? { fontWeight: 800, color: b.color } : undefined}
            >
              {b.label}
              <br />
              <span className="num">{b.range}</span>
            </span>
          ))}
        </div>
      </div>
      {generatedAt && (
        <span className="muted" style={{ fontSize: 12.5 }}>
          Calculado em <span className="num">{dateTime(generatedAt)}</span>
        </span>
      )}
    </div>
  )
}
