import { useEffect, useState } from "react";
import {
    Plus,
    Save,
    CheckCircle,
    Image,
    Trash2,
    Gamepad2,
    ImageIcon,
    Copy,
    MoveRight,
} from "lucide-react";
import {
    createGame,
    getAllQuestions,
    addQuestionToGame,
} from "../services/api";
import type { Question } from "../types";
import { useNavigate } from "react-router-dom";

export default function GameCreate() {
    const [name, setName] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedGameId, setSavedGameId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [inviteLink, setInviteLink] = useState<string>("");
    const [linkCopied, setLinkCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

        fetchAllQuestions();
    }, []);

    const isInGame = (questionId: string) =>
        questions.some((q) => q.id === questionId);

    const removeFromGame = (questionId: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    };

    const generateInviteLink = (gameId: string) => {
        const { protocol, hostname, port } = window.location;
        const fullPort = port ? `:${port}` : "";
        return `${protocol}//${hostname}${fullPort}/game/${gameId}`;
    };

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error("Clipboard error:", err);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mb-4 mx-auto"></div>
                    <p className="text-lg text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <Gamepad2 className="w-8 h-8 text-purple-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Create New Game
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Build your custom game by selecting questions
                    </p>
                    <div className="mt-6">
                        <a
                            onClick={() => navigate("/questions/create")}
                            className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg disabled:opacity-50"
                        >
                            Create Question
                            <MoveRight className="inline w-5 h-5 ml-2" />
                        </a>
                    </div>
                </div>

                {/* Game Name */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <label className="block text-lg font-semibold mb-2 text-gray-700">
                        Game Name
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter game name..."
                        className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                </div>

                {/* Selected Questions */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="text-green-500 w-6 h-6" />
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
                            <p className="text-gray-400 text-sm mt-2">Choose below to get started</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {questions.map((q) => (
                                <div key={q.id} className="p-6 rounded-xl border-2 border-green-200 bg-green-50">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Question</span>
                                            {/* <p className="text-xl font-bold">{q.word}</p> */}
                                        </div> 
                                        <button
                                            onClick={() => removeFromGame(q.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {q.image_urls?.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`Image ${i + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.src = "https://via.placeholder.com/100?text=Image+Error";
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Questions */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <ImageIcon className="text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Available Questions
                        </h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {allQuestions.length} total
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {allQuestions.map((q) => (
                            <div
                                key={q.id}
                                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                                    isInGame(q.id)
                                        ? "bg-gray-50 border-gray-200 opacity-75"
                                        : "bg-blue-50 hover:shadow-lg border-blue-200"
                                }`}
                            >
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            Question
                                        </span>
                                        {/* <p className="text-xl font-bold">{q.word}</p> */}
                                    </div>
                                    {!isInGame(q.id) ? (
                                        <button
                                            onClick={() => setQuestions((prev) => [...prev, q])}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-purple-700"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    ) : (
                                        <span className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-5 h-5" />
                                            Added
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {q.image_urls?.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Clue ${i + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                target.src = "https://via.placeholder.com/100?text=Image+Error";
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Game */}
                <div className="text-center">
                    <button
                        onClick={handleSave}
                        disabled={!name || questions.length === 0 || saving}
                        className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                                Saving...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                Save Game
                            </div>
                        )}
                    </button>
                </div>

                {/* Success Message */}
                {savedGameId && (
                    <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                        <CheckCircle className="text-green-500 w-8 h-8 mx-auto mb-2" />
                        <h3 className="text-lg font-bold text-green-700">Game created!</h3>
                        <p className="text-green-600 text-sm mt-2">
                            Share this link:
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-3">
                            <input
                                value={inviteLink}
                                readOnly
                                className="px-4 py-2 border border-green-300 rounded-lg w-full max-w-md"
                            />
                            <button
                                onClick={copyInviteLink}
                                className={`px-4 py-2 rounded-lg font-semibold ${
                                    linkCopied
                                        ? "bg-green-600 text-white"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                                <Copy className="w-4 h-4 inline mr-1" />
                                {linkCopied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
