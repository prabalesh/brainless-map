package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	db *mongo.Database
}

func NewHandler(db *mongo.Database) *Handler {
	return &Handler{db}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/games", h.HandleAllGames)
	mux.HandleFunc("POST /api/users", h.HandleUser)
	mux.HandleFunc("POST /api/games", h.HandleGames)
	mux.HandleFunc("POST /api/games/{id}/questions", h.HandleAddQuestionToGame)
	mux.HandleFunc("GET /api/games/{id}/questions", h.HandleGetQuestionsByGame)
	mux.HandleFunc("GET /api/questions", h.HandleAllQuestions)
	mux.HandleFunc("POST /api/questions", h.HandleCreateQuestion)
	mux.HandleFunc("GET /api/images/search", h.HandleImageSearch)
	mux.HandleFunc("GET /api/questions/{id}", h.HandleGetQuestionByID)
}

func (h *Handler) HandleUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	user.SessionID = utils.GenerateSessionID()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := h.db.Collection("users").InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Failed to save user", http.StatusInternalServerError)
		return
	}
	user.ID = res.InsertedID.(primitive.ObjectID)
	json.NewEncoder(w).Encode(user)
}

func (h *Handler) HandleGames(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var game model.Game
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	game.QuestionIDs = []primitive.ObjectID{}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := h.db.Collection("games").InsertOne(ctx, game)
	if err != nil {
		http.Error(w, "Failed to create game", http.StatusInternalServerError)
		return
	}
	game.ID = res.InsertedID.(primitive.ObjectID)
	json.NewEncoder(w).Encode(game)
}

func (h *Handler) HandleAddQuestionToGame(w http.ResponseWriter, r *http.Request) {
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

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = h.db.Collection("games").UpdateByID(ctx, gameObjID, bson.M{
		"$addToSet": bson.M{"question_ids": questionObjID},
	})
	if err != nil {
		http.Error(w, "Failed to add question to game", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) HandleGetQuestionsByGame(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := r.PathValue("id")
	gameObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid game ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Fetch the game document
	var game model.Game
	err = h.db.Collection("games").FindOne(ctx, bson.M{"_id": gameObjID}).Decode(&game)
	if err != nil {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	// If no question IDs, return empty question list
	if len(game.QuestionIDs) == 0 {
		response := struct {
			Game      model.Game       `json:"game"`
			Questions []model.Question `json:"questions"`
		}{
			Game:      game,
			Questions: []model.Question{},
		}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Fetch questions from DB using $in
	cursor, err := h.db.Collection("questions").Find(ctx, bson.M{
		"_id": bson.M{"$in": game.QuestionIDs},
	})
	if err != nil {
		http.Error(w, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}

	var questions []model.Question
	if err := cursor.All(ctx, &questions); err != nil {
		http.Error(w, "Failed to parse questions", http.StatusInternalServerError)
		return
	}

	// Final response
	response := struct {
		Game      model.Game       `json:"game"`
		Questions []model.Question `json:"questions"`
	}{
		Game:      game,
		Questions: questions,
	}

	json.NewEncoder(w).Encode(response)
}

func (h *Handler) HandleAllQuestions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cursor, err := h.db.Collection("questions").Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}
	var questions []model.Question
	if err := cursor.All(ctx, &questions); err != nil {
		http.Error(w, "Failed to parse questions", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(questions)
}

func (h *Handler) HandleImageSearch(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	w.Header().Set("Content-Type", "application/json")
	images := utils.FetchUnsplashImages(q)
	json.NewEncoder(w).Encode(images)
}

func (h *Handler) HandleCreateQuestion(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	var q model.Question
	if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := h.db.Collection("questions").InsertOne(ctx, q)
	if err != nil {
		http.Error(w, "Failed to create question", http.StatusInternalServerError)
		return
	}
	q.ID = res.InsertedID.(primitive.ObjectID)
	json.NewEncoder(w).Encode(q)
}

func (h *Handler) HandleGetQuestionByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	questionObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid question ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var question model.Question
	err = h.db.Collection("questions").FindOne(ctx, bson.M{"_id": questionObjID}).Decode(&question)
	if err != nil {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(question)
}

func (h *Handler) HandleAllGames(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := h.db.Collection("games").Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch games", http.StatusInternalServerError)
		return
	}

	var games []model.Game
	if err := cursor.All(ctx, &games); err != nil {
		http.Error(w, "Failed to parse games", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(games)
}
