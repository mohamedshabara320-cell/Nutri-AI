import ProgressBar from "@/components/ui/ProgressBar";

export default function CalorieSummary({
  consumed,
  target,
}: {
  consumed: number;
  target: number;
}) {
  const remaining = Math.max(0, Math.round(target - consumed));
  const over = consumed > target;

  return (
    <div className="card">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {over ? "Over target" : "Remaining"}
          </p>
          <p className={`text-3xl font-bold ${over ? "text-red-500" : ""}`}>
            {over ? `+${Math.round(consumed - target)}` : remaining}
            <span className="ml-1 text-base font-medium text-gray-400">kcal</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Consumed / Target</p>
          <p className="font-semibold">
            {Math.round(consumed)} / {Math.round(target)}
          </p>
        </div>
      </div>
      <ProgressBar value={consumed} max={target} colorClass={over ? "bg-red-500" : "bg-brand-500"} />
    </div>
  );
}
