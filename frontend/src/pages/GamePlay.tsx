import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions, getQuestionById } from "../services/api";
import type { Game, Question } from "../types";

export default function GamePlay() {
    const { id } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [guess, setGuess] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [game, setGame] = useState<Game | null>(null);
    const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [currentImageLoadStatus, setCurrentImageLoadStatus] = useState<boolean[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchGameQuestions = async () => {
            setLoading(true);
            try {
                const res = await getQuestions(id);
                const game = res.data.game;
                setGame(game);

                if (game.question_ids && game.question_ids.length > 0) {
                    const questionPromises = game.question_ids.map((qid: string) => getQuestionById(qid));
                    const results = await Promise.allSettled(questionPromises);

                    const loadedQuestions: Question[] = [];

                    results.forEach((res) => {
                        if (res.status === "fulfilled") {
                            loadedQuestions.push(res.value.data);
                        }
                    });

                    setQuestions(loadedQuestions);
                }
            } catch (err) {
                console.error("Failed to load game questions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameQuestions();
    }, [id]);

    useEffect(() => {
        if (questions[currentIndex]) {
            const imageCount = questions[currentIndex].image_urls.length;
            setCurrentImageLoadStatus(Array(imageCount).fill(false));
        }
    }, [currentIndex, questions]);

    const handleCheckAnswer = () => {
        const current = questions[currentIndex];
        if (!current) return;

        if (guess.trim().toLowerCase() === current.word.toLowerCase()) {
            setShowResult('correct');
            setScore(score + 1);
            setTimeout(() => {
                if (currentIndex + 1 < questions.length) {
                    setCurrentIndex(currentIndex + 1);
                    setShowResult(null);
                } else {
                    setCompleted(true);
                }
            }, 1500);
        } else {
            setShowResult('wrong');
            setTimeout(() => {
                setShowResult(null);
            }, 1500);
        }
        setGuess("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCheckAnswer();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading your game...</p>
                </div>
            </div>
        );
    }

    if (!gameStarted && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-4">
                    <div className="text-6xl mb-6">🎮</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome to
                    </h1>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                        {game?.name || "Your Game"}
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold text-blue-600">{questions.length}</span> questions await you!
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Look at the images and guess the word they represent
                        </p>
                    </div>
                    <button
                        onClick={() => setGameStarted(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    if (completed) {
        const percentage = Math.round((score / questions.length) * 100);
        let performanceMessage = "";
        let emoji = "";

        if (percentage === 100) {
            performanceMessage = "Perfect! You're a master!";
            emoji = "🏆";
        } else if (percentage >= 80) {
            performanceMessage = "Excellent work!";
            emoji = "🌟";
        } else if (percentage >= 60) {
            performanceMessage = "Good job!";
            emoji = "👍";
        } else if (percentage >= 40) {
            performanceMessage = "Not bad, keep practicing!";
            emoji = "💪";
        } else {
            performanceMessage = "Keep trying, you'll get better!";
            emoji = "📚";
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-4">
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">
                        Game Complete!
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="text-4xl font-bold text-gray-800 mb-2">
                            {score} / {questions.length}
                        </div>
                        <div className="text-lg text-gray-600 mb-3">
                            {percentage}% Correct
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <p className="text-lg font-semibold text-green-600">
                            {performanceMessage}
                        </p>
                    </div>
                    <p className="text-gray-600 mb-6">
                        You completed <span className="font-semibold text-gray-800">{game?.name}</span>!
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Play Again
                        </button>
                        <a
                            href="/dashboard"
                            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                        >
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="text-5xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        No Questions Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any questions for this game.
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {game?.name || "Game"}
                        </h1>
                        <div className="text-sm text-gray-600">
                            Question {currentIndex + 1} of {questions.length}
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                        <h2 className="text-xl font-semibold">
                            What word do these images represent?
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {q.image_urls.map((url, i) => {
                                const imageLoaded = currentImageLoadStatus[i];
                                return (
                                    <div key={i} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={url}
                                            alt={`Hint ${i + 1}`}
                                            onLoad={() => {
                                                setCurrentImageLoadStatus((prev) => {
                                                    const updated = [...prev];
                                                    updated[i] = true;
                                                    return updated;
                                                });
                                            }}
                                            className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                        />
                                        {!imageLoaded && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                                                <div className="text-gray-400 text-center">
                                                    <div className="animate-pulse">
                                                        <div className="text-2xl mb-2">🖼️</div>
                                                        <div className="text-sm">Loading image {i + 1}...</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <input
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Type your answer..."
                                    disabled={showResult !== null}
                                />
                                {showResult && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                                        {showResult === 'correct' ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleCheckAnswer}
                                disabled={!guess.trim() || showResult !== null}
                                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </div>

                {showResult && (
                    <div className={`mt-6 p-4 rounded-lg text-center transition-all duration-300 ${
                        showResult === 'correct' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        <div className="text-lg font-semibold">
                            {showResult === 'correct' ? '🎉 Correct!' : '❌ Wrong! Try again.'}
                        </div>
                        {showResult === 'correct' && currentIndex + 1 < questions.length && (
                            <div className="text-sm mt-1">Moving to next question...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
