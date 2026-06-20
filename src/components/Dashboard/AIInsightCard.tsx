export default function AIInsightCard({
  insight,
}: {
  insight?: string;
}) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10" />

      <div className="relative space-y-2">
        <p className="text-xs text-gray-400">AI Insight</p>

        <p className="text-base font-semibold">
          {insight || "Your progress is improving this week 🚀"}
        </p>

        <p className="text-sm text-gray-400">
          AI is analyzing your nutrition patterns automatically
        </p>
      </div>
    </div>
  );
}