import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getSummary } from "../api";

export default function LiveTraffic() {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const poll = async () => {
      try {
        const summary = await getSummary();
        if (!alive) return;
        const now = new Date(summary.timestamp).toLocaleTimeString();
        const next = {
          time: now,
          "backend-1": summary.traffic_last_60s["backend-1"] ?? 0,
          "backend-2": summary.traffic_last_60s["backend-2"] ?? 0,
        };
        setPoints((old) => [...old.slice(-19), next]);
        setError("");
      } catch (e) {
        if (alive) setError(e.message);
      }
    };

    poll();
    const timer = setInterval(poll, 2500);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Live Traffic</h2>
          <p>Requests handled in the rolling 60-second window.</p>
        </div>
        <span className="live-dot">LIVE</span>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="chart">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="backend-1" name="Backend 1" />
            <Bar dataKey="backend-2" name="Backend 2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
