import { useState } from "react";
import { Plus, Save, CheckCircle, Image, Trash2, Gamepad2, ImageIcon, Share2, Copy } from "lucide-react";
import {
    createGame,
    getAllQuestions,
    addQuestionToGame,
} from "../services/api";
import type { Question } from "../types";

export default function GameCreate() {
    const [name, setName] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedGameId, setSavedGameId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [inviteLink, setInviteLink] = useState<string>("");
    const [linkCopied, setLinkCopied] = useState(false);

    const fetchAllQuestions = async () => {
        try {
            const res = await getAllQuestions();
            setAllQuestions(res.data || []);
        } catch (err) {
            console.error("Failed to load questions:", err);
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        fetchAllQuestions();
    });

    const isInGame = (questionId: string) =>
        questions.some((q) => q.id === questionId);

    const removeFromGame = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    const generateInviteLink = (gameId: string) => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';
        return `${protocol}//${hostname}${port}/game/${gameId}`;
    };

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = inviteLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Please enter a game name.");
            return;
        }
        if (questions.length === 0) {
            alert("Please select at least one question.");
            return;
        }

        setSaving(true);
        try {
            const user_id = localStorage.getItem("user_id") || "anonymous";
            const gameRes = await createGame(user_id, name);
            const gameId = gameRes.data.id;
            setSavedGameId(gameId);

            for (const q of questions) {
                await addQuestionToGame(gameId, q.id);
            }

            // Generate invite link
            const link = generateInviteLink(gameId);
            setInviteLink(link);

            alert("Game created successfully!");
        } catch (err) {
            console.error("Failed to create game:", err);
            alert("Error creating game");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Gamepad2 className="h-8 w-8 text-purple-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Create New Game
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">Build your custom game by selecting questions</p>
                </div>

                {/* Game Name Input */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
                    <label htmlFor="gameName" className="block text-lg font-semibold text-gray-700 mb-3">
                        Game Name
                    </label>
                    <input
                        id="gameName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter a creative name for your game..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200 text-lg"
                    />
                </div>

                {/* Selected Questions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Selected Questions
                        </h2>
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                            {questions.length} selected
                        </span>
                    </div>
                    
                    {questions.length === 0 ? (
                        <div className="text-center py-12">
                            <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No questions selected yet</p>
                            <p className="text-gray-400 text-sm mt-2">Choose from the questions below to get started</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {questions.map((q) => (
                                <div key={q.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                                Answer
                                            </span>
                                            <p className="text-xl font-bold text-gray-800">{q.word}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromGame(q.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                                            title="Remove from game"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    {q.image_urls && q.image_urls.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {q.image_urls.map((url, i) => (
                                                <div key={i} className="relative group">
                                                    <img
                                                        src={url}
                                                        className="w-full h-24 object-cover rounded-lg border-2 border-white shadow-sm group-hover:shadow-md transition-shadow duration-200"
                                                        alt={`Clue ${i + 1}`}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity duration-200"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                            <Image className="h-8 w-8 text-gray-400" />
                                            <span className="text-gray-500 ml-2">No images available</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Questions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                        <ImageIcon className="h-6 w-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Available Questions</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {allQuestions.length} total
                        </span>
                    </div>
                    
                    <div className="grid gap-6">
                        {allQuestions.map((q) => (
                            <div key={q.id} className={`rounded-xl p-6 border-2 transition-all duration-200 ${
                                isInGame(q.id) 
                                    ? 'bg-gray-50 border-gray-200 opacity-75' 
                                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-md hover:border-purple-300'
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                            Answer
                                        </span>
                                        <p className="text-xl font-bold text-gray-800">{q.word}</p>
                                    </div>
                                    {!isInGame(q.id) && (
                                        <button
                                            onClick={() => setQuestions((prev) => [...prev, q])}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add to Game
                                        </button>
                                    )}
                                    {isInGame(q.id) && (
                                        <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                            <CheckCircle className="h-4 w-4" />
                                            Added
                                        </span>
                                    )}
                                </div>
                                
                                {q.image_urls == null || q.image_urls.length === 0 ? (
                                    <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                        <span className="text-gray-500 ml-2">No images available</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {q.image_urls.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={url}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-white shadow-sm group-hover:shadow-md transition-shadow duration-200"
                                                    alt={`Clue ${i + 1}`}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity duration-200"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="text-center">
                    <button
                        onClick={handleSave}
                        disabled={!name || questions.length === 0 || saving}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Creating Game...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Game
                            </>
                        )}
                    </button>
                </div>

                {/* Success Message with Invite */}
                {savedGameId && (
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                        <div className="text-center mb-6">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                            <p className="text-green-800 text-lg font-semibold mb-2">
                                🎉 Game created successfully!
                            </p>
                            <p className="text-green-700">
                                Game ID: <code className="bg-green-100 px-2 py-1 rounded font-mono text-sm">{savedGameId}</code>
                            </p>
                        </div>
                        
                        {/* Invite Section */}
                        <div className="border-t border-green-200 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Share2 className="h-6 w-6 text-green-600" />
                                <h3 className="text-xl font-bold text-green-800">Invite Players</h3>
                            </div>
                            
                            <p className="text-green-700 mb-4">
                                Share this link with friends to let them join your game:
                            </p>
                            
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-white border-2 border-green-200 rounded-lg font-mono text-sm focus:outline-none focus:border-green-400"
                                />
                                <button
                                    onClick={copyInviteLink}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                        linkCopied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    <Copy className="h-4 w-4" />
                                    {linkCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            
                            <p className="text-green-600 text-sm mt-3">
                                Players can use this link to join and start playing your custom game!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}