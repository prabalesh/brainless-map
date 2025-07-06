import { useEffect, useState } from "react";
import { Play, Image, Users, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("session_id") && localStorage.getItem("user_id") && localStorage.getItem("name")) {
      navigate("/dashboard");
      console.log("Navigate to dashboard");
    }
  }, []);

  const handleStart = async () => {
    if (!name.trim()) {
      alert("Please enter your name to continue");
      return;
    }

    setIsLoading(true);
    try {
      const res = await createUser(name);
      localStorage.setItem("session_id", res.data.session_id);
      localStorage.setItem("user_id", res.data.id);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
      console.log("Navigate to dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Image className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              Image Word
            </h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Guess Game
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Challenge your mind with visual puzzles! Look at the images and guess the word. 
            Create custom games and share them with friends.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Play className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Start?</h3>
            <p className="text-purple-200">Enter your name and let's begin the adventure!</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-lg font-semibold text-white mb-3">
                Your Name
              </label>
              <input
                id="playerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition-all duration-200 text-lg backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>

            <button 
              onClick={handleStart} 
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Getting Ready...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start Playing
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Visual Puzzles</h4>
            <p className="text-purple-200">Engaging image-based challenges that test your creativity</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Social Gaming</h4>
            <p className="text-purple-200">Create and share custom games with friends and family</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-200 hover:scale-105">
            <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Achievements</h4>
            <p className="text-purple-200">Track your progress and compete with other players</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-purple-300 text-lg">
            Join thousands of players worldwide!
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}