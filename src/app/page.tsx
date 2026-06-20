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
          mealTime: "dinner",
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

  const recommendations = data?.suggestions?.recommendations;
  const remaining = data?.remaining;

  return (
    <div style={{ padding: 20 }}>
      <h1>Nutri App</h1>

      <button onClick={generate} disabled={loading}>
        {loading ? "Loading..." : "Generate"}
      </button>

      {data?.error && <div>{data.error}</div>}

      {remaining && (
        <div>
          <p>Calories: {remaining.remainingCalories}</p>
          <p>Protein: {remaining.remainingProtein}</p>
          <p>Carbs: {remaining.remainingCarbs}</p>
          <p>Fat: {remaining.remainingFat}</p>
        </div>
      )}

      {Array.isArray(recommendations) && recommendations.length > 0 ? (
        recommendations.map((item: any, i: number) => (
          <div key={i}>
            <h3>{item.name}</h3>
            <p>{item.calories}</p>
            <p>{item.reason}</p>
          </div>
        ))
      ) : (
        !loading &&
        data &&
        !data?.error && <div>No recommendations found</div>
      )}
    </div>
  );
}