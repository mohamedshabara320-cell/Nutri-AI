export default function StreakCard({ streak = 0 }) {
  return (
    <div className="card text-center">
      <p className="text-xs text-gray-400">Daily Streak</p>
      <p className="text-2xl font-bold">{streak} 🔥</p>
      <p className="text-sm text-gray-400">days in a row</p>
    </div>
  );
}