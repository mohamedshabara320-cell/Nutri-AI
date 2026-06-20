"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CalorieChart({ data }: { data: any[] }) {
  return (
    <div className="card h-64">
      <p className="text-xs text-gray-400 mb-2">Calories Trend</p>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#22c55e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}