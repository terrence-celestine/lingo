import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle size={22} className="text-red-400" />
      </div>
      <p className="text-sm font-medium text-gray-800 mb-1">
        Oops, something went wrong
      </p>
      <p className="text-xs text-gray-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-white border border-gray-100 hover:border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
