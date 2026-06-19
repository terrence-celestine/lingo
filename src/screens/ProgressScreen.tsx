import TopNav from "../components/TopNav";
import { useUserStats } from "../context/UserStateContext";
import { Zap, Flame, Heart, Star } from "lucide-react";

export default function ProgressScreen() {
  const { stats, xpIntoCurrentLevel, xpForNextLevel } = useUserStats();

  const xpProgress = Math.round(
    (xpIntoCurrentLevel() / xpForNextLevel()) * 100,
  );

  const statCards = [
    {
      label: "Total XP",
      value: stats.xp.toLocaleString(),
      sub: "all time",
      icon: Zap,
      bg: "bg-amber-50",
      text: "text-amber-500",
    },
    {
      label: "Day streak",
      value: stats.streak,
      sub: "days in a row",
      icon: Flame,
      bg: "bg-orange-50",
      text: "text-orange-500",
    },
    {
      label: "Current level",
      value: stats.level,
      sub: `${xpIntoCurrentLevel()} / ${xpForNextLevel()} XP`,
      icon: Star,
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
    {
      label: "Hearts",
      value: 3,
      sub: "full health",
      icon: Heart,
      bg: "bg-red-50",
      text: "text-red-400",
    },
  ];

  const levels = Array.from({ length: 5 }, (_, i) => {
    const level = i + 1;
    const levelXpStart = (level - 1) * 500;
    const levelXpEnd = level * 500;
    const isCompleted = stats.xp >= levelXpEnd;
    const isCurrent = stats.level === level;
    const fillPct = isCompleted
      ? 100
      : isCurrent
        ? Math.round(((stats.xp - levelXpStart) / 500) * 100)
        : 0;

    return { level, levelXpStart, levelXpEnd, isCompleted, isCurrent, fillPct };
  });

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNav />

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Your progress</h1>
          <p className="text-sm text-gray-400 mt-1">
            Keep learning to level up.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map(({ label, value, sub, icon: Icon, bg, text }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div
                className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <Icon size={17} className={text} />
              </div>
              <p className="text-2xl font-medium text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              <p className="text-xs text-gray-300 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Level progress bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-800">
              Level {stats.level}
            </p>
            <span className="text-xs text-gray-400">
              {xpProgress}% to next level
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-300">
              {xpIntoCurrentLevel()} XP
            </span>
            <span className="text-xs text-gray-300">{xpForNextLevel()} XP</span>
          </div>
        </div>

        {/* Level milestones */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-medium text-gray-800">
              Level milestones
            </p>
          </div>
          {levels.map(
            ({ level, levelXpEnd, isCompleted, isCurrent, fillPct }) => (
              <div
                key={level}
                className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0
                ${isCurrent ? "bg-blue-50" : ""}`}
              >
                {/* Level badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium flex-shrink-0
                ${isCompleted ? "bg-amber-400 text-white" : isCurrent ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {isCompleted ? "✓" : level}
                </div>

                {/* Label + bar */}
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <p
                      className={`text-xs font-medium ${isCurrent ? "text-blue-700" : isCompleted ? "text-gray-700" : "text-gray-400"}`}
                    >
                      Level {level} {isCurrent && "· current"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {levelXpEnd.toLocaleString()} XP
                    </p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-amber-400" : "bg-blue-400"}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </main>
    </div>
  );
}
