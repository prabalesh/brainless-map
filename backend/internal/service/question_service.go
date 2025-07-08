package service

import (
	"context"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionService struct {
	repo *repository.QuestionRepository
}

func NewQuestionService(repo *repository.QuestionRepository) *QuestionService {
	return &QuestionService{repo}
}

func (s *QuestionService) Create(ctx context.Context, q *model.Question) error {
	return s.repo.CreateQuestion(ctx, q)
}

func (s *QuestionService) GetAll(ctx context.Context) ([]model.Question, error) {
	return s.repo.GetAll(ctx)
}

func (s *QuestionService) GetByID(ctx context.Context, id primitive.ObjectID) (*model.Question, error) {
	return s.repo.GetByID(ctx, id)
}
