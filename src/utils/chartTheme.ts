// ═══════════════════════════════════════════════════════
// CHART THEME — Recharts inline-style tokens that follow
// the active light/dark theme via CSS variables.
//
// Recharts' contentStyle / wrapperStyle / tick fill expect
// inline CSS, so we forward `var(--color-...)` references.
// ═══════════════════════════════════════════════════════

export const chartTooltipStyle: React.CSSProperties = {
  background: 'var(--color-surface-elevated)',
  border: '1px solid var(--color-edge-default)',
  borderRadius: '12px',
  padding: '10px 14px',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
  color: 'var(--color-text-primary)',
};

export const chartTooltipLabelStyle: React.CSSProperties = {
  color: 'var(--color-text-primary)',
  fontWeight: 600,
  marginBottom: 6,
  fontSize: 12,
};

export const chartTooltipItemStyle: React.CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontSize: 12,
  padding: '2px 0',
};

export const chartLegendStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
};

/** Use as `tick={{ ...chartAxisTick }}` on Recharts XAxis/YAxis. */
export const chartAxisTick = {
  fill: 'var(--color-text-faint)',
  fontSize: 11,
  fontWeight: 500,
} as const;

/** Subtle grid stroke that works on both themes. */
export const chartGridStroke = 'var(--color-edge-subtle)';

/** Cursor highlight for hover ridges. */
export const chartCursorStroke = 'rgba(59, 130, 246, 0.25)';
