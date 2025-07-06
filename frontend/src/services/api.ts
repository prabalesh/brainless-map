import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create a user
export const createUser = (name: string) =>
  axios.post(`${BASE}/users`, { name });

// Create a game
export const createGame = (user_id: string, name: string) =>
  axios.post(`${BASE}/games`, { user_id, name });

// ✅ Get all games
export const getAllGames = () => axios.get(`${BASE}/games`);

// ✅ Create a standalone question (not tied to a game)
export const createQuestion = (word: string, image_urls: string[]) =>
  axios.post(`${BASE}/questions`, { word, image_urls });

// ✅ Add an existing question to a game
export const addQuestionToGame = (gameId: string, questionId: string) =>
  fetch(`${BASE}/games/${gameId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ existing_question_id: questionId }),
  });

// ✅ Add a new question directly to a game
export const addQuestionToGameDirect = (
  gameId: string,
  word: string,
  image_urls: string[]
) =>
  axios.post(`${BASE}/games/${gameId}/questions`, { word, image_urls });

// Get all questions for a game
export const getQuestions = (game_id: string) =>
  axios.get(`${BASE}/games/${game_id}/questions`);

// Get all questions in the system
export const getAllQuestions = () => axios.get(`${BASE}/questions`);

// Get a question by ID
export const getQuestionById = (id: string) =>
  axios.get(`${BASE}/questions/${id}`);

// Search for images
export const searchImages = (q: string) =>
  axios.get(`${BASE}/images/search?q=${q}`);
