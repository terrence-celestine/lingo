import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Trophy, TrendingUp, Languages, X, Check } from "lucide-react";
import { useUserStats } from "../context/UserStateContext";

export default function TopNav() {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, updateDisplayName, resetProgress, updateAvatar } =
    useUserStats();
  const [nameInput, setNameInput] = useState(stats.displayName);
  const [confirmReset, setConfirmReset] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const links = [
    { to: "/", label: "Learn", icon: Zap },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/progress", label: "Progress", icon: TrendingUp },
  ];

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
        setConfirmReset(false);
      }
    }
    if (modalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  function handleSaveName() {
    if (nameInput.trim()) updateDisplayName(nameInput.trim().slice(0, 20));
    setModalOpen(false);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
    setModalOpen(false);
  }

  return (
    <nav className="hidden md:flex bg-white border-b border-gray-100 px-6 h-13 items-center gap-6 relative">
      <Link to="/" className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white">
          <Languages size={15} />
        </div>
        <span className="text-sm font-medium text-gray-900">Lingo</span>
      </Link>

      <div className="flex items-center gap-1 flex-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${
                location.pathname === to
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-800 text-xs font-medium px-3 py-1.5 rounded-full">
          {stats.streak} 🔥
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
          <Zap size={11} />
          {stats.xp} XP
        </div>
        <button
          onClick={() => {
            setModalOpen((o) => !o);
            setNameInput(stats.displayName);
            setConfirmReset(false);
          }}
          className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-200 hover:border-blue-400 transition-colors text-base"
        >
          {stats.avatar}
        </button>
      </div>

      {/* Settings modal */}
      {modalOpen && (
        <div
          ref={modalRef}
          className="absolute top-14 right-6 w-72 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-medium text-gray-900">Settings</p>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-300 hover:text-gray-500"
            >
              <X size={15} />
            </button>
          </div>
          {/* Avatar picker */}
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-3">Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => updateAvatar(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all
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
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-2">Display name</p>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                maxLength={20}
                className="flex-1 text-sm bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-gray-800 outline-none focus:border-blue-300"
                placeholder="Your name"
              />
              <button
                onClick={handleSaveName}
                className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Check size={14} />
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs text-gray-400 mb-3">Your stats</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "XP", value: stats.xp.toLocaleString() },
                { label: "Streak", value: `${stats.streak} 🔥` },
                { label: "Level", value: stats.level },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-xl p-2.5 text-center"
                >
                  <p className="text-sm font-medium text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reset progress */}
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-2">Danger zone</p>
            <button
              onClick={handleReset}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  confirmReset
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-red-50 hover:bg-red-100 text-red-500"
                }`}
            >
              {confirmReset
                ? "Are you sure? Click to confirm"
                : "Reset all progress"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
