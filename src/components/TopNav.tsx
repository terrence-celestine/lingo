import { Link, useLocation } from "react-router-dom";
import { Zap, Trophy, TrendingUp, Languages } from "lucide-react";
import type { UserStats } from "../types";

interface Props {
  stats: UserStats;
}

export default function TopNav({ stats }: Props) {
  const location = useLocation();

  const links = [
    { to: "/", label: "Learn", icon: Zap },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-6 h-13 flex items-center gap-6">
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
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-medium flex items-center justify-center border-2 border-blue-200">
          TC
        </div>
      </div>
    </nav>
  );
}
