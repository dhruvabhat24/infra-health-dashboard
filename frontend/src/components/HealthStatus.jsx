import { useEffect, useState } from "react";
import { getSummary } from "../api";

const SERVICES = [
  "frontend", "backend-1", "backend-2",
  "database", "dns", "loadbalancer"
];

export default function HealthStatus() {
  const [health, setHealth] = useState({});
  const [updated, setUpdated] = useState(null);

  useEffect(() => {
    let alive = true;

    const poll = async () => {
      try {
        const summary = await getSummary();
        if (!alive) return;
        setHealth(summary.health || {});
        setUpdated(new Date(summary.timestamp));
      } catch (_) {}
    };

    poll();
    const timer = setInterval(poll, 3000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Health Status</h2>
          <p>HTTP health probes collected by metrics-api.</p>
        </div>
        {updated && <span className="muted">{updated.toLocaleTimeString()}</span>}
      </div>

      <div className="health-grid">
        {SERVICES.map((service) => {
          const item = health[service];
          const ok = item?.status === "ok";
          return (
            <article className={`health-card ${ok ? "ok" : "bad"}`} key={service}>
              <div className="health-icon">{ok ? "✓" : "!"}</div>
              <div>
                <h3>{service}</h3>
                <strong>{ok ? "Healthy" : "Unhealthy"}</strong>
                {item?.http_status && <small>HTTP {item.http_status}</small>}
                {item?.detail && <small>{item.detail}</small>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
