export default function NetworkMap() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Network Map</h2>
          <p>Blue lines are allowed paths. The red path is deliberately blocked by network isolation + firewall defense-in-depth.</p>
        </div>
      </div>

      <svg className="network-map" viewBox="0 0 1000 650" role="img" aria-label="Infra network map">
        <rect x="25" y="25" width="950" height="245" rx="20" className="net public" />
        <text x="50" y="62" className="net-title">frontend-net · PUBLIC</text>

        <rect x="25" y="305" width="950" height="320" rx="20" className="net private" />
        <text x="50" y="342" className="net-title">backend-net · PRIVATE / INTERNAL</text>

        {/* Allowed logical paths */}
        <line x1="175" y1="150" x2="390" y2="150" className="link allowed" />
        <line x1="175" y1="150" x2="610" y2="150" className="link allowed" />
        <line x1="390" y1="150" x2="285" y2="445" className="link allowed" />
        <line x1="390" y1="150" x2="715" y2="445" className="link allowed" />
        <line x1="610" y1="150" x2="285" y2="445" className="link allowed thin" />
        <line x1="610" y1="150" x2="715" y2="445" className="link allowed thin" />
        <line x1="285" y1="445" x2="500" y2="545" className="link allowed" />
        <line x1="715" y1="445" x2="500" y2="545" className="link allowed" />
        <line x1="285" y1="445" x2="500" y2="400" className="link allowed thin" />
        <line x1="715" y1="445" x2="500" y2="400" className="link allowed thin" />

        {/* Deliberately blocked path */}
        <line x1="175" y1="150" x2="500" y2="545" className="link blocked" />
        <rect x="335" y="315" width="100" height="32" rx="8" className="blocked-label" />
        <text x="385" y="337" textAnchor="middle" className="blocked-text">BLOCKED</text>

        <Node x={175} y={150} title="Frontend" subtitle="nginx :3000" />
        <Node x={390} y={150} title="Load Balancer" subtitle="nginx :8080" />
        <Node x={610} y={150} title="Metrics API" subtitle="Flask :5001" />
        <Node x={285} y={445} title="Backend 1" subtitle="Flask :5000" />
        <Node x={715} y={445} title="Backend 2" subtitle="Flask :5000" />
        <Node x={500} y={400} title="DNS" subtitle="172.29.0.53 · db.internal" />
        <Node x={500} y={545} title="PostgreSQL" subtitle="172.29.0.10 :5432" />
      </svg>

      <div className="legend">
        <span><i className="legend-line allowed-line" /> Allowed</span>
        <span><i className="legend-line blocked-line" /> Firewall blocked</span>
      </div>
    </section>
  );
}

function Node({ x, y, title, subtitle }) {
  return (
    <g>
      <rect x={x - 90} y={y - 34} width="180" height="68" rx="14" className="node" />
      <text x={x} y={y - 3} textAnchor="middle" className="node-title">{title}</text>
      <text x={x} y={y + 19} textAnchor="middle" className="node-subtitle">{subtitle}</text>
    </g>
  );
}
