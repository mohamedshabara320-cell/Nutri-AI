"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { WeightLog } from "@/types";

export default function WeightChart({ logs }: { logs: WeightLog[] }) {
  const data = logs.map((l) => ({
    date: new Date(l.logged_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: l.weight_kg,
  }));

  if (data.length === 0) {
    return <p className="text-center text-sm text-gray-400">No weigh-ins logged yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{ borderRadius: 12, fontSize: 12, border: "none" }}
          formatter={(v: number) => [`${v} kg`, "Weight"]}
        />
        <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
