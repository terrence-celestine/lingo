import { useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  Zap,
  RotateCcw,
  Home,
  BookOpen,
  XCircle,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import type { Question } from "../types";
import { useUserStats } from "../context/UserStateContext";
import PageTransition from "../components/PageTransition";
import { playComplete, playLevelUp, playWrong } from "../lib/sounds";
import { useQuery } from "@tanstack/react-query";
import { lessonQueries } from "../lib/queries";

interface LocationState {
  sessionXp: number;
  correct: number;
  total: number;
  lessonId: string;
  wrongQuestions: Question[];
}

export default function CompleteScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    stats,
    xpIntoCurrentLevel,
    xpForNextLevel,
    completeLesson,
    language,
  } = useUserStats();

  const {
    sessionXp = 0,
    correct = 0,
    total = 0,
    lessonId,
    wrongQuestions = [],
  } = (location.state as LocationState) ?? {};

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xpProgress = (xpIntoCurrentLevel() / xpForNextLevel()) * 100;

  const { data: lessons = [] } = useQuery(lessonQueries.all(language));
  const { completedLessons } = useUserStats();

  const currentLesson = lessons.find((l) => l.id === Number(lessonId));
  const nextLesson = lessons.find(
    (l) => l.order === (currentLesson?.order ?? 0) + 1,
  );
  const nextUnlocked =
    !!nextLesson && completedLessons.includes(Number(lessonId));

  useEffect(() => {
    if (wrongQuestions.length === 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#5B8AF0", "#1D9E75", "#FAC775", "#F0997B", "#ED93B1"],
      });
      if (lessonId) completeLesson(Number(lessonId));
    }
    if (xpProgress >= 100) {
      playLevelUp();
    } else if (wrongQuestions.length > 0) {
      playWrong();
    } else {
      playComplete();
    }
  }, []);

  return (
    <>
      <PageTransition>
        <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center text-center">
          {/* Trophy */}
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            {wrongQuestions.length === 0 ? (
              <Star size={36} className="text-amber-400" />
            ) : (
              <XCircle size={36} className="text-red-400" />
            )}
          </div>

          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            {wrongQuestions.length === 0
              ? "Lesson complete!"
              : "Lesson failed!"}
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {stats.streak > 1
              ? `${stats.streak} day streak — keep it going!`
              : "Great start — come back tomorrow!"}
          </p>

          {/* Stats row */}
          <div className="w-full grid grid-cols-3 gap-3 mb-8">
            {[
              {
                label: "XP earned",
                value: `+${sessionXp}`,
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                label: "Streak",
                value: `${stats.streak}`,
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                <p className={`text-xl font-medium ${s.color} mb-1`}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Level progress */}
          <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Zap size={14} className="text-amber-400" />
                Level {stats.level}
              </div>
              <span className="text-xs text-gray-400">
                {xpIntoCurrentLevel()} / {xpForNextLevel()} XP
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
            {xpProgress >= 100 && (
              <p className="text-xs text-amber-600 font-medium mt-2">
                🎉 You leveled up!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            {/* Next lesson button */}
            {nextUnlocked && nextLesson ? (
              <button
                onClick={() => navigate(`/quiz/${nextLesson.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors"
              >
                <ArrowRight size={15} /> Next lesson — {nextLesson.title}
              </button>
            ) : (
              <button
                onClick={() =>
                  lessonId ? navigate(`/quiz/${lessonId}`) : navigate("/")
                }
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors"
              >
                <RotateCcw size={15} /> Try again
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 hover:border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <Home size={15} /> Back to lessons
            </button>
            {/* Review button */}
            {wrongQuestions.length > 0 && (
              <button
                onClick={() =>
                  navigate("/review", { state: { wrongQuestions } })
                }
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 hover:border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
              >
                <BookOpen size={15} /> Review {wrongQuestions.length} mistake
                {wrongQuestions.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
