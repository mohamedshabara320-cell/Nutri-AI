import ProgressBar from "@/components/ui/ProgressBar";

interface MacroRowProps {
  label: string;
  consumed: number;
  target: number;
  colorClass: string;
}

function MacroRow({ label, consumed, target, colorClass }: MacroRowProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {Math.round(consumed)}g / {Math.round(target)}g
        </span>
      </div>
      <ProgressBar value={consumed} max={target} colorClass={colorClass} />
    </div>
  );
}

export default function MacroProgress({
  protein,
  carbs,
  fat,
  proteinTarget,
  carbTarget,
  fatTarget,
}: {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}) {
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Macros</h2>
      <MacroRow label="Protein" consumed={protein} target={proteinTarget} colorClass="bg-blue-500" />
      <MacroRow label="Carbs" consumed={carbs} target={carbTarget} colorClass="bg-amber-500" />
      <MacroRow label="Fat" consumed={fat} target={fatTarget} colorClass="bg-rose-500" />
    </div>
  );
}
