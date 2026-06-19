import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Coffee,
  ArrowRight,
  Lock,
  CheckCircle,
  Plane,
  Heart,
  Leaf,
  Dumbbell,
  Briefcase,
  Music,
  Zap,
} from "lucide-react";
import { useUserStats } from "../context/UserStateContext";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { lessonQueries } from "../lib/queries";
import ErrorState from "../components/ErrorState";
import PageTransition from "../components/PageTransition";

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
  Travel: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: <Plane size={18} className="text-purple-600" />,
  },
  Health: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <Heart size={18} className="text-red-500" />,
  },
  Nature: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <Leaf size={18} className="text-green-600" />,
  },
  Lifestyle: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: <Dumbbell size={18} className="text-orange-500" />,
  },
  Work: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    icon: <Briefcase size={18} className="text-slate-500" />,
  },
  Culture: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    icon: <Music size={18} className="text-pink-500" />,
  },
  Advanced: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: <Zap size={18} className="text-amber-500" />,
  },
};

const DIFFICULTY_BADGE: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  Beginner: { label: "Beginner", bg: "bg-green-50", text: "text-green-600" },
  Intermediate: {
    label: "Intermediate",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  Advanced: { label: "Advanced", bg: "bg-red-50", text: "text-red-500" },
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const { completedLessons, isLessonUnlocked, language, updateLanguage } =
    useUserStats();
  const {
    data: lessons = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery(lessonQueries.all(language));

  const LANGUAGES = [
    {
      code: "Spanish",
      flag: "https://flagcdn.com/w40/es.png",
      label: "Spanish",
    },
    { code: "French", flag: "https://flagcdn.com/w40/fr.png", label: "French" },
  ];

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  }

  if (isError)
    return <ErrorState message="Couldn't load lessons." onRetry={refetch} />;

  return (
    <PageTransition>
      <div>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900">
              {getGreeting()}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Pick a lesson to continue your streak.
            </p>
          </div>
          {/* Language selector */}
          <div className="flex gap-2 mb-6">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => updateLanguage(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2
                ${
                  language === lang.code
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                <img
                  src={lang.flag}
                  alt={lang.label}
                  className="w-5 h-3.5 rounded-sm object-cover"
                />
                {lang.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <Skeleton circle width={40} height={40} className="mb-4" />
                  <Skeleton width={60} height={12} className="mb-1" />
                  <Skeleton width={100} height={14} className="mb-1" />
                  <Skeleton count={2} height={12} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => {
                const color = CATEGORY_COLORS[lesson.category] ?? {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  icon: <BookOpen size={18} className="text-gray-500" />,
                };
                const unlocked = isLessonUnlocked(lesson.order, lessons);
                const completed = completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => unlocked && navigate(`/quiz/${lesson.id}`)}
                    className={`rounded-2xl border p-5 text-left transition-all group
                  ${
                    completed
                      ? "bg-teal-500 border-teal-400 cursor-pointer"
                      : unlocked
                        ? "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm cursor-pointer"
                        : "bg-white border-gray-100 opacity-60 cursor-not-allowed"
                  }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${completed ? "bg-teal-400" : color.bg}`}
                      >
                        {completed ? (
                          <CheckCircle size={18} className="text-white" />
                        ) : (
                          color.icon
                        )}
                      </div>
                      {completed && (
                        <CheckCircle size={16} className="text-teal-200 mt-1" />
                      )}
                      {!unlocked && !completed && (
                        <Lock size={16} className="text-gray-300 mt-1" />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium mb-1 ${completed ? "text-teal-100" : color.text}`}
                    >
                      {lesson.category}
                    </div>
                    <div
                      className={`text-sm font-medium mb-1 ${completed ? "text-white" : "text-gray-900"}`}
                    >
                      {lesson.title}
                    </div>
                    <div
                      className={`text-xs leading-relaxed ${completed ? "text-teal-100" : "text-gray-400"}`}
                    >
                      {lesson.description}
                    </div>
                    {(() => {
                      const badge =
                        DIFFICULTY_BADGE[lesson.difficulty] ??
                        DIFFICULTY_BADGE["Beginner"];
                      return (
                        <div
                          className={`mt-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </div>
                      );
                    })()}
                    {unlocked && !completed && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Start lesson <ArrowRight size={12} />
                      </div>
                    )}
                    {completed && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-teal-100 font-medium">
                        Completed <CheckCircle size={12} />
                      </div>
                    )}
                    {!unlocked && !completed && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-gray-300 font-medium">
                        Complete previous lesson <Lock size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
