import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Coffee, ArrowRight } from "lucide-react";
import TopNav from "../components/TopNav";
import { useUserStats } from "../hooks/useUserStats";
import type { Lesson } from "../types";

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  Basics: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <BookOpen size={18} className="text-blue-600" />,
  },
  "Daily Life": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: <Coffee size={18} className="text-teal-600" />,
  },
};

export default function HomeScreen() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { stats } = useUserStats();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/lessons")
      .then((r) => r.json())
      .then((data) => {
        setLessons(data);
        setLoading(false);
      });
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <TopNav stats={stats} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">
            {getGreeting()}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Pick a lesson to continue your streak.
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading lessons...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => {
              const color = CATEGORY_COLORS[lesson.category] ?? {
                bg: "bg-gray-50",
                text: "text-gray-700",
                icon: <BookOpen size={18} className="text-gray-500" />,
              };
              return (
                <button
                  key={lesson.id}
                  onClick={() => navigate(`/quiz/${lesson.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:border-blue-200 hover:shadow-sm transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center mb-4`}
                  >
                    {color.icon}
                  </div>
                  <div className={`text-xs font-medium mb-1 ${color.text}`}>
                    {lesson.category}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {lesson.title}
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    {lesson.description}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Start lesson <ArrowRight size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
