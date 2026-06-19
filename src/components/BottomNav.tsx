import { Link, useLocation } from "react-router-dom";
import { Zap, Trophy, TrendingUp, Settings } from "lucide-react";
import { useUserStats } from "../context/UserStateContext";

export default function BottomNav() {
  const location = useLocation();
  const { stats } = useUserStats();

  const links = [
    { to: "/", label: "Learn", icon: Zap },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/progress", label: "Progress", icon: TrendingUp },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center z-50 md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors
            ${location.pathname === to ? "text-blue-500" : "text-gray-400"}`}
        >
          <Icon size={20} />
          {label}
        </Link>
      ))}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-gray-100 shadow-sm">
        <span className="text-xs font-medium text-orange-500">
          {stats.streak} 🔥
        </span>
        <span className="text-gray-200 text-xs">·</span>
        <span className="text-xs font-medium text-amber-600">
          {stats.xp} XP
        </span>
      </div>
    </nav>
  );
}
