export async function getSummary(signal) {
  const response = await fetch("/api/metrics/summary", { signal });
  if (!response.ok) throw new Error(`metrics-api returned ${response.status}`);
  return response.json();
}
