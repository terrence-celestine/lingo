import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X,
  Volume2,
  ArrowRight,
  CheckCircle,
  XCircle,
  Heart,
  Flame,
} from "lucide-react";
import { useUserStats } from "../context/UserStateContext";
import type { Question } from "../types";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { lessonQueries, leaderboardQueries } from "../lib/queries";
import ErrorState from "../components/ErrorState";
import PageTransition from "../components/PageTransition";

const HEARTS_MAX = 3;

export default function QuizScreen() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { stats, addXp, xpIntoCurrentLevel, xpForNextLevel } = useUserStats();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hearts, setHearts] = useState(HEARTS_MAX);
  const [sessionXp, setSessionXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);

  const {
    data: questions = [],
    isLoading: questionsLoading,
    isError,
    refetch,
  } = useQuery(lessonQueries.questions(lessonId!));
  const { data: leaderboard = [] } = useQuery(leaderboardQueries.all());

  const loading = questionsLoading;
  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const isAnswered = selected !== null;
  const isCorrect = selected === q?.correctIndex;

  function handleSelect(index: number) {
    if (isAnswered) return;
    setSelected(index);
    if (index === q.correctIndex) {
      setCorrect((c) => c + 1);
    } else {
      setHearts((h) => h - 1);
      setWrongQuestions((prev) => [...prev, q]);
    }
  }

  function handleNext() {
    const xpGained = isCorrect ? 10 : 0;
    if (xpGained > 0) {
      addXp(xpGained);
      setSessionXp((s) => s + xpGained);
    }

    const newHearts = isCorrect ? hearts : hearts - 1;
    const nextIndex = current + 1;

    if (newHearts <= 0 || nextIndex >= questions.length) {
      navigate("/complete", {
        state: {
          sessionXp: sessionXp + xpGained,
          correct,
          total: questions.length,
          lessonId,
          wrongQuestions,
        },
      });
      return;
    }

    setHearts(newHearts);
    setSelected(null);
    setCurrent(nextIndex);
  }

  function speak() {
    const utterance = new SpeechSynthesisUtterance(q.prompt);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  }

  function getOptClass(index: number) {
    if (!isAnswered)
      return "border-gray-100 bg-white hover:border-blue-200 cursor-pointer";
    if (index === q.correctIndex)
      return "border-teal-400 bg-teal-50 cursor-default";
    if (index === selected && !isCorrect)
      return "border-orange-300 bg-orange-50 cursor-default";
    return "border-gray-100 bg-white opacity-40 cursor-default";
  }

  useEffect(() => {
    if (!questions.length) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (["1", "2", "3", "4"].includes(e.key)) {
        handleSelect(Number(e.key) - 1);
      }
      if (e.key === "Enter" && isAnswered) {
        handleNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    questions.length,
    isAnswered,
    selected,
    current,
    hearts,
    sessionXp,
    correct,
  ]);

  if (loading)
    return (
      <>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-6 pb-28 md:pb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <Skeleton circle width={28} height={28} />
              <Skeleton height={8} className="flex-1" />
              <Skeleton width={60} height={16} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-5">
              <Skeleton width={120} height={12} className="mx-auto mb-3" />
              <Skeleton width={280} height={40} className="mx-auto mb-2" />
              <Skeleton width={80} height={12} className="mx-auto mb-4" />
              <Skeleton
                width={80}
                height={30}
                className="mx-auto"
                borderRadius={99}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={48} borderRadius={12} />
              ))}
            </div>
          </div>
          <div className="w-52 shrink-0 flex flex-col gap-5">
            <Skeleton height={160} borderRadius={16} />
            <Skeleton height={80} borderRadius={16} />
            <Skeleton height={180} borderRadius={16} />
          </div>
        </div>
      </>
    );

  if (isError)
    return <ErrorState message="Couldn't load Lesson." onRetry={refetch} />;

  const heartsLeft = isAnswered && !isCorrect ? hearts - 1 : hearts;

  return (
    <>
      <PageTransition>
        <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6">
          {/* Main quiz area */}
          <div className="flex-1">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => navigate("/")}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(progress, 2)}%` }}
                />
              </div>
              <div className="flex gap-1 shrink-0">
                {Array.from({ length: HEARTS_MAX }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-base ${i < heartsLeft ? "text-red-400" : "text-gray-200"}`}
                  >
                    <Heart
                      size={16}
                      color={i < heartsLeft ? "red" : "gray"}
                      fill={i < heartsLeft ? "red" : "gray"}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-8 text-center mb-5">
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
                Translate to English
              </p>
              <p className="text-2xl md:text-4xl font-medium text-gray-900 mb-2 tracking-tight">
                {q.prompt}
              </p>
              {q.hint && <p className="text-xs text-gray-300 mb-4">{q.hint}</p>}
              <button
                onClick={speak}
                className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-blue-500 text-xs font-medium px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                <Volume2 size={13} /> Listen
              </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${getOptClass(i)}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium shrink-0
                  ${
                    isAnswered && i === q.correctIndex
                      ? "bg-teal-500 border-teal-500 text-white"
                      : isAnswered && i === selected && !isCorrect
                        ? "bg-orange-400 border-orange-400 text-white"
                        : "border-gray-200 text-gray-400"
                  }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-gray-800">{opt}</span>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <div
                className={`rounded-xl border-2 px-4 py-3 flex items-start gap-3 mb-4 animate-bounce-in
    ${isCorrect ? "bg-teal-50 border-teal-300" : "bg-orange-50 border-orange-300"}`}
              >
                {isCorrect ? (
                  <CheckCircle
                    size={17}
                    className="text-teal-500 mt-0.5 shrink-0"
                  />
                ) : (
                  <XCircle
                    size={17}
                    className="text-orange-400 mt-0.5 shrink-0"
                  />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${isCorrect ? "text-teal-800" : "text-orange-800"}`}
                  >
                    {isCorrect
                      ? "Correct! +10 XP"
                      : `Incorrect — correct answer is ${String.fromCharCode(65 + q.correctIndex)}`}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${isCorrect ? "text-teal-600" : "text-orange-600"}`}
                  >
                    {q.hint}
                  </p>
                </div>
              </div>
            )}

            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {current + 1 >= questions.length
                  ? "Finish lesson"
                  : "Next question"}{" "}
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {/* Right panel */}
          <div className="hidden md:flex w-52 shrink-0 flex-col gap-5">
            {/* Session stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
                This session
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Streak", value: `${stats.streak}`, icon: Flame },
                  {
                    label: "Accuracy",
                    value:
                      current > 0
                        ? `${Math.round((correct / current) * 100)}%`
                        : "—",
                  },
                  { label: "XP today", value: `+${sessionXp}` },
                  {
                    label: "Hearts",
                    value: `${heartsLeft}`,
                    icon: Heart,
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F7F8FC] rounded-xl p-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                    <p className="text-base font-medium text-gray-900 flex items-center gap-1">
                      {s.value}{" "}
                      <span>
                        {s?.icon && <s.icon size={16} color="red" fill="red" />}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Level progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
                Level progress
              </p>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Level {stats.level}</span>
                <span>
                  {xpIntoCurrentLevel()} / {xpForNextLevel()} XP
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: `${(xpIntoCurrentLevel() / xpForNextLevel()) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">
                This week
              </p>
              <div className="flex flex-col gap-0">
                {leaderboard.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-xs text-gray-300 w-4 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-medium flex items-center justify-center shrink-0">
                      {entry.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-xs text-gray-700 flex-1 truncate">
                      {entry.name.split(" ")[0]}
                    </span>
                    <span className="text-xs text-gray-400">{entry.xp}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 py-1.5 mt-0.5">
                  <span className="text-xs text-blue-500 w-4 text-center font-medium">
                    {leaderboard.length + 1}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-medium flex items-center justify-center shrink-0">
                    TC
                  </div>
                  <span className="text-xs text-blue-600 font-medium flex-1">
                    You
                  </span>
                  <span className="text-xs text-blue-500">{stats.xp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
