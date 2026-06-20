export default function AIWeeklyInsight({
  caloriesTrend,
}: {
  caloriesTrend?: "up" | "down" | "stable";
}) {
  const message =
    caloriesTrend === "up"
      ? "Your calorie intake increased this week. Consider balancing protein."
      : caloriesTrend === "down"
      ? "Good control! You're staying in range consistently."
      : "Stable nutrition pattern detected. Keep going.";

  return (
    <div className="card">
      <p className="text-xs text-gray-400">Weekly AI Report</p>
      <p className="font-semibold">{message}</p>
    </div>
  );
}