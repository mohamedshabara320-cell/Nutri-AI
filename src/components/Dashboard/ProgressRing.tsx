export default function ProgressRing({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const percent = Math.min((value / max) * 100, 100);

  const radius = 38;
  const stroke = 7;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold">
        {Math.round(value)} / {Math.round(max)}
      </p>
    </div>
  );
}