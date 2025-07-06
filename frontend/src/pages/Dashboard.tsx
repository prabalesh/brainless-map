import { Plus, Gamepad2, User, Sparkles, ArrowRight, Play, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllGames } from "../services/api";
import { useState, useEffect } from "react";
import type { Game } from "../types";

export default function Dashboard() {
  const name = localStorage.getItem("name") || "User";
  const navigate = useNavigate();
  const [games, setGames] = useState<(Game)[]>([]);
  const [loading, setLoading] = useState(true);

  const createNewGame = async () => {
    navigate(`/game/create`);
    console.log("Navigate to game create page");
  };

  const playGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
    console.log(`Navigate to game ${gameId}`);
  };

  const fetchGames = async () => {
    try {
      const response = await getAllGames();
      setGames(response.data || []);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back,
              </h1>
              <p className="text-3xl font-bold text-gray-800">
                {name}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ready to create something amazing? Design your custom game and challenge your friends!
          </p>
        </div>

        {/* Main Action Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100 hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Game</h2>
            <p className="text-gray-600">Build your personalized game with custom questions</p>
          </div>

          <div className="max-w-md mx-auto">
            <button 
              onClick={createNewGame} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Plus className="h-5 w-5" />
              Create Game
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Available Games Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Available Games</h2>
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
              {games.length} games
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading games...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 text-center">
              <Gamepad2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No games available yet</p>
              <p className="text-gray-400 text-sm">Create your first game to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 truncate">
                        {game.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{game.question_ids.length} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Game ID: {game.id.slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => playGame(game.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play Game
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Questions</h3>
            <p className="text-gray-600">Add your own questions with multiple images for each answer</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Sharing</h3>
            <p className="text-gray-600">Share your games with friends and family instantly</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fun Gameplay</h3>
            <p className="text-gray-600">Engaging visual puzzles that challenge and entertain</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg mb-4">
            What are you waiting for? Let's get started!
          </p>
          <div className="flex justify-center gap-2">
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}