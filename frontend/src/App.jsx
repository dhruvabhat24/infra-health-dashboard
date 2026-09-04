import { useState } from "react";
import LiveTraffic from "./components/LiveTraffic";
import HealthStatus from "./components/HealthStatus";
import NetworkMap from "./components/NetworkMap";

const views = {
  traffic: { label: "Live Traffic", component: LiveTraffic },
  health: { label: "Health Status", component: HealthStatus },
  network: { label: "Network Map", component: NetworkMap },
};

export default function App() {
  const [view, setView] = useState("traffic");
  const View = views[view].component;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DEVOPS PORTFOLIO PROJECT</p>
          <h1>Infra Health Dashboard</h1>
          <p className="subtitle">Docker networking · active health checks · Prometheus · React</p>
        </div>
        <div className="architecture-pill">WSL2 + Docker</div>
      </header>

      <nav className="tabs">
        {Object.entries(views).map(([key, item]) => (
          <button
            key={key}
            className={view === key ? "tab active" : "tab"}
            onClick={() => setView(key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <View />
    </main>
  );
}
