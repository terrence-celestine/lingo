import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserStatsProvider } from "./context/UserStateContext";
import AppLayout from "./components/AppLayout";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import CompleteScreen from "./screens/CompleteScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ReviewScreen from "./screens/ReviewScreen";
import SettingsScreen from "./screens/SettingsScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // cache for 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserStatsProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/quiz/:lessonId" element={<QuizScreen />} />
              <Route path="/complete" element={<CompleteScreen />} />
              <Route path="/leaderboard" element={<LeaderboardScreen />} />
              <Route path="/progress" element={<ProgressScreen />} />
              <Route path="/review" element={<ReviewScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </UserStatsProvider>
    </QueryClientProvider>
  );
}
