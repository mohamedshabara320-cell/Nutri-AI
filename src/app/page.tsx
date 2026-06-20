"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    try {
      setLoading(true);
      setData(null);

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: 20,
          goal: "weight loss",
        }),
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      setData({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  const recommendations = data?.recommendations;

  return (
    <div style={{ padding: 20 }}>
      <h1>Nutri App</h1>

      <button onClick={generate} disabled={loading}>
        {loading ? "Loading..." : "Generate Recommendations"}
      </button>

      {data?.error && <div>{data.error}</div>}

      {Array.isArray(recommendations) &&
        recommendations.map((item: any, i: number) => (
          <div key={i}>
            <h3>{item.name}</h3>
            <p>{item.calories}</p>
            <p>{item.reason}</p>
          </div>
        ))}

      {!loading &&
        data &&
        !data?.error &&
        !Array.isArray(recommendations) && (
          <div>No recommendations found</div>
        )}
    </div>
  );
}