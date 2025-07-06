import { Route, Routes } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Brain, Home, Plus, Gamepad2, HelpCircle } from "lucide-react";
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GamePlay from "./pages/GamePlay";
import GameCreate from "./pages/GameCreate";
import QuestionCreate from "./pages/QuestionCreate";

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Brainless Map
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/game/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/game/create")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Game</span>
            </Link>

            <Link
              to="/questions/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/questions/create")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Create Question</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:id" element={<GamePlay />} />
          <Route path="/game/create" element={<GameCreate />} />
          <Route path="/questions/create" element={<QuestionCreate />} />
        </Routes>
      </main>
    </div>
  );
}