import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";
import type { Question } from "../types";

interface LocationState {
  wrongQuestions: Question[];
  lessonId: string;
}

export default function ReviewScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const { wrongQuestions = [], lessonId } =
    (location.state as LocationState) ?? {};

  return (
    <>
      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">
            Review mistakes
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {wrongQuestions.length} question
            {wrongQuestions.length > 1 ? "s" : ""} to go over.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {wrongQuestions.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Question */}
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-xs uppercase tracking-widest text-gray-300 mb-1">
                  Question
                </p>
                <p className="text-lg font-medium text-gray-900">{q.prompt}</p>
                {q.hint && (
                  <p className="text-xs text-gray-400 mt-1">{q.hint}</p>
                )}
              </div>

              {/* Options */}
              <div className="px-5 py-4 flex flex-col gap-2">
                {q.options.map((opt, j) => {
                  const isCorrect = j === q.correctIndex;
                  return (
                    <div
                      key={j}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                        ${
                          isCorrect
                            ? "bg-teal-50 border border-teal-200"
                            : "bg-gray-50 border border-gray-100 opacity-50"
                        }`}
                    >
                      {isCorrect ? (
                        <CheckCircle
                          size={15}
                          className="text-teal-500 flex-shrink-0"
                        />
                      ) : (
                        <XCircle
                          size={15}
                          className="text-gray-300 flex-shrink-0"
                        />
                      )}
                      <span
                        className={
                          isCorrect
                            ? "text-teal-800 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/quiz/${lessonId}`)}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-3 rounded-xl transition-colors"
          >
            <RotateCcw size={15} /> Try again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 hover:border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-xl transition-colors"
          >
            <Home size={15} /> Back to lessons
          </button>
        </div>
      </main>
    </>
  );
}
