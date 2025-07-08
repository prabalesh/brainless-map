package handler

import (
	"encoding/json"
	"net/http"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionHandler struct {
	svc *service.QuestionService
}

func NewQuestionHandler(svc *service.QuestionService) *QuestionHandler {
	return &QuestionHandler{svc}
}

func (h *QuestionHandler) HandleCreateQuestion(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var q model.Question
	if err := json.NewDecoder(r.Body).Decode(&q); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.svc.Create(r.Context(), &q); err != nil {
		http.Error(w, "Failed to create question", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(q)
}

func (h *QuestionHandler) HandleAllQuestions(w http.ResponseWriter, r *http.Request) {
	questions, err := h.svc.GetAll(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch questions", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questions)
}

func (h *QuestionHandler) HandleGetQuestionByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid question ID", http.StatusBadRequest)
		return
	}

	question, err := h.svc.GetByID(r.Context(), objID)
	if err != nil {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(question)
}
