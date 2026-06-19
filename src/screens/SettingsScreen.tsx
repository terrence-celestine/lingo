import { useState } from "react";
import { Check } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useUserStats } from "../context/UserStateContext";

const AVATARS = [
  "🦊",
  "🐼",
  "🦁",
  "🐸",
  "🐧",
  "🦄",
  "🐙",
  "🦋",
  "🐺",
  "🦅",
  "🐬",
  "🌟",
];

export default function SettingsScreen() {
  const { stats, updateDisplayName, updateAvatar, resetProgress } =
    useUserStats();
  const [nameInput, setNameInput] = useState(stats.displayName);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleSaveName() {
    if (nameInput.trim()) updateDisplayName(nameInput.trim().slice(0, 20));
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-24">
      {/* Mobile header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 md:hidden">
        <h1 className="text-base font-medium text-gray-900">Settings</h1>
      </div>

      <main className="max-w-lg mx-auto px-5 py-6 flex flex-col gap-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs uppercase tracking-widest text-gray-300 mb-1">
              Profile
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl border-2 border-blue-100">
                {stats.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stats.displayName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Level {stats.level} · {stats.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          {/* Avatar picker */}
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-3">Choose avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => updateAvatar(emoji)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all
                    ${
                      stats.avatar === emoji
                        ? "bg-blue-100 border-2 border-blue-400 scale-110"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Display name */}
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-2">Display name</p>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                maxLength={20}
                className="flex-1 text-sm bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-800 outline-none focus:border-blue-300"
                placeholder="Your name"
              />
              <button
                onClick={handleSaveName}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Check size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
            Your stats
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total XP", value: stats.xp.toLocaleString() },
              { label: "Streak", value: `${stats.streak} 🔥` },
              { label: "Level", value: stats.level },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 rounded-xl p-3 text-center"
              >
                <p className="text-base font-medium text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
            Danger zone
          </p>
          <button
            onClick={handleReset}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-colors
              ${
                confirmReset
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-red-50 hover:bg-red-100 text-red-500"
              }`}
          >
            {confirmReset
              ? "Are you sure? Tap to confirm"
              : "Reset all progress"}
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
