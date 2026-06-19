import { useUserStats } from "../context/UserStateContext";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { leaderboardQueries } from "../lib/queries";
import ErrorState from "../components/ErrorState";

export default function LeaderboardScreen() {
  const { stats } = useUserStats();
  const { data: leaderboard = [], isLoading: loading, isError, refetch} = useQuery(
    leaderboardQueries.all(),
  );

  const AVATAR_COLORS: Record<number, { bg: string; text: string }> = {
    0: { bg: "bg-amber-50", text: "text-amber-700" },
    1: { bg: "bg-gray-50", text: "text-gray-500" },
    2: { bg: "bg-orange-50", text: "text-orange-700" },
  };

  const medals = ["🥇", "🥈", "🥉"];

  const yourRank = leaderboard.filter((e) => e.xp > stats.xp).length + 1;

  if (isError)
    return <ErrorState message="Couldn't load leaderboard." onRetry={refetch} />;

  return (
    <>
      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Leaderboard</h1>
          <p className="text-sm text-gray-400 mt-1">Top learners this week.</p>
        </div>

        {/* Your rank card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center shrink-0 border-2 border-blue-200">
            TC
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">Your ranking</p>
            <p className="text-xs text-blue-500 mt-0.5">
              #{yourRank} · {stats.xp} XP · {stats.streak} day streak 🔥
            </p>
          </div>
          <div className="text-2xl font-medium text-blue-600">#{yourRank}</div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0"
              >
                <Skeleton circle width={28} height={28} />
                <Skeleton circle width={40} height={40} />
                <div className="flex-1">
                  <Skeleton width={80} height={13} className="mb-1" />
                  <Skeleton width={60} height={11} />
                </div>
                <Skeleton width={40} height={13} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {i < 3 ? (
                    <span className="text-lg">{medals[i]}</span>
                  ) : (
                    <span className="text-sm text-gray-300 font-medium">
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0
                  ${AVATAR_COLORS[i]?.bg ?? "bg-purple-50"} ${AVATAR_COLORS[i]?.text ?? "text-purple-700"}`}
                >
                  {entry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Name + streak */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {entry.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {entry.streak} day streak 🔥
                  </p>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-800">
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
              </div>
            ))}

            {/* Your row at the bottom */}
            <div className="flex items-center gap-4 px-5 py-4 bg-blue-50 border-t border-blue-100">
              <div className="w-8 text-center shrink-0">
                <span className="text-sm text-blue-500 font-medium">
                  #{yourRank}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center shrink-0 border-2 border-blue-200">
                TC
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">You</p>
                <p className="text-xs text-blue-400 mt-0.5">
                  {stats.streak} day streak 🔥
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-blue-700">
                  {stats.xp.toLocaleString()}
                </p>
                <p className="text-xs text-blue-400">XP</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
