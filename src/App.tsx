import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserStatsProvider } from "./context/UserStateContext";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import CompleteScreen from "./screens/CompleteScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProgressScreen from "./screens/ProgressScreen";
import ReviewScreen from "./screens/ReviewScreen";

export default function App() {
  return (
    <UserStatsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/quiz/:lessonId" element={<QuizScreen />} />
          <Route path="/complete" element={<CompleteScreen />} />
          <Route path="/leaderboard" element={<LeaderboardScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
        </Routes>
      </BrowserRouter>
    </UserStatsProvider>
  );
}
