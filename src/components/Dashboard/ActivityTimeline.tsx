export default function ActivityTimeline({ meals }: { meals: any[] }) {
  return (
    <div className="card space-y-3">
      <p className="text-sm text-gray-400">Activity</p>

      {meals.slice(0, 5).map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between border-b border-white/5 pb-2"
        >
          <div>
            <p className="font-medium">{m.meal_name}</p>
            <p className="text-xs text-gray-400">
              {Math.round(m.calories)} kcal
            </p>
          </div>

          <div className="text-xs text-green-400">logged</div>
        </div>
      ))}
    </div>
  );
}