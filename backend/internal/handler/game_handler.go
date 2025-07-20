package handler

import (
	"encoding/json"
	"net/http"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/service"
	"github.com/prabalesh/brainless-map/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GameHandler struct {
	svc *service.GameService
}

func NewGameHandler(svc *service.GameService) *GameHandler {
	return &GameHandler{svc}
}

func (h *GameHandler) HandleCreateGame(w http.ResponseWriter, r *http.Request) {
	var game model.Game
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if err := h.svc.CreateGame(r.Context(), &game); err != nil {
		http.Error(w, "Failed to create game", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

func (h *GameHandler) HandleAllGames(w http.ResponseWriter, r *http.Request) {
	games, err := h.svc.GetAllGames(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch games", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
}

func (h *GameHandler) HandleGetQuestionsByGame(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	gameID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid game ID", http.StatusBadRequest)
		return
	}

	game, questions, err := h.svc.GetGameWithQuestions(r.Context(), gameID)
	if err != nil {
		http.Error(w, "Failed to get game/questions", http.StatusInternalServerError)
		return
	}

	response := struct {
		Game      *model.Game      `json:"game"`
		Questions []model.Question `json:"questions"`
	}{
		Game:      game,
		Questions: questions,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *GameHandler) HandleImageSearch(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	w.Header().Set("Content-Type", "application/json")
	images := utils.FetchUnsplashImages(q)
	json.NewEncoder(w).Encode(images)
}

func (h *GameHandler) HandleAddQuestionToGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	gameObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid game ID", http.StatusBadRequest)
		return
	}

	var body struct {
		ExistingQuestionID string `json:"existing_question_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	questionObjID, err := primitive.ObjectIDFromHex(body.ExistingQuestionID)
	if err != nil {
		http.Error(w, "Invalid question ID", http.StatusBadRequest)
		return
	}

	if err := h.svc.AddQuestionToGame(r.Context(), gameObjID, questionObjID); err != nil {
		http.Error(w, "Failed to add question to game", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
