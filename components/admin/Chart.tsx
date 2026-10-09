"use client";

type Point = { date: string; count: number };

export default function SignupsChart({ data }: { data: Point[] }) {
  if (data.length === 0) return <div className="dash__empty">No signup data yet.</div>;

  const width = 720;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? chartW / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartH - (d.count / max) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${padding.top + chartH} L${points[0].x.toFixed(1)},${padding.top + chartH} Z`;

  const tickIndexes = [0, Math.floor(points.length / 2), points.length - 1];

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Signups over the last 30 days">
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={width - padding.right}
          y2={padding.top + chartH}
          stroke="var(--border)"
        />
        <path d={areaPath} fill="var(--lavender-50)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--primary)">
            <title>{`${p.date}: ${p.count}`}</title>
          </circle>
        ))}
        {tickIndexes.map((i) => (
          <text key={i} x={points[i].x} y={height - 6} fontSize={11} fill="var(--muted)" textAnchor="middle">
            {points[i].date.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  );
}
