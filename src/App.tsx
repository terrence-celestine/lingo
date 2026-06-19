import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import CompleteScreen from "./screens/CompleteScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/quiz/:lessonId" element={<QuizScreen />} />
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
