const SERIES_VARS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
  'var(--series-7)',
  'var(--series-8)',
]

export type BarDatum = { label: string; value: number }

/** Nominal-categorical horizontal bar chart: each bar is a subject
 * (identity, not magnitude-ranked color), fixed hue per position, direct
 * value labels shipped by default per the dataviz skill's contrast-relief
 * rule (several series slots sit below 3:1 against our light paper
 * surface — validated via validate_palette.js — so labels are not
 * optional decoration here, they're the accessibility mitigation). */
export function BarChart({ data, unit, formatValue }: { data: BarDatum[]; unit: string; formatValue?: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const format = formatValue ?? ((v: number) => String(v))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, i) => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 120, fontSize: 13, color: 'var(--ink-soft)', flexShrink: 0 }}>{d.label}</span>
          <div style={{ flex: 1, background: 'var(--paper-sunken)', borderRadius: 6, height: 20, position: 'relative' }}>
            <div
              className="stagger-item"
              style={{
                animationDelay: `${i * 60}ms`,
                width: `${(d.value / max) * 100}%`,
                height: '100%',
                background: SERIES_VARS[i % SERIES_VARS.length],
                borderRadius: 6,
                minWidth: d.value > 0 ? 4 : 0,
              }}
            />
          </div>
          <span className="tabular" style={{ width: 64, fontSize: 13, textAlign: 'right', color: 'var(--ink)', flexShrink: 0 }}>
            {format(d.value)}
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
