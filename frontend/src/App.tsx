import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GamePlay from "./pages/GamePlay";
import GameCreate from "./pages/GameCreate";
import QuestionCreate from "./pages/QuestionCreate";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/game/:id" element={<GamePlay />} />
      <Route path="/game/create" element={<GameCreate />} />
      <Route path="/questions/create" element={<QuestionCreate />} />
    </Routes>
  );
}
