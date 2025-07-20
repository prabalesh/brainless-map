package service

import (
	"context"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GameService struct {
	gameRepo     *repository.GameRepository
	questionRepo *repository.QuestionRepository
}

func NewGameService(gameRepo *repository.GameRepository, questionRepo *repository.QuestionRepository) *GameService {
	return &GameService{gameRepo, questionRepo}
}

func (s *GameService) CreateGame(ctx context.Context, game *model.Game) error {
	id, err := s.gameRepo.Create(ctx, game)
	if err != nil {
		return err
	}
	game.ID = id
	return nil
}

func (s *GameService) GetAllGames(ctx context.Context) ([]model.Game, error) {
	return s.gameRepo.FindAll(ctx)
}

func (s *GameService) GetGameWithQuestions(ctx context.Context, id primitive.ObjectID) (*model.Game, []model.Question, error) {
	game, err := s.gameRepo.GetByID(ctx, id)
	if err != nil {
		return nil, nil, err
	}

	if len(game.QuestionIDs) == 0 {
		return game, []model.Question{}, nil
	}

	questions, err := s.questionRepo.GetByIDs(ctx, game.QuestionIDs)
	if err != nil {
		return nil, nil, err
	}

	return game, questions, nil
}

func (s *GameService) AddQuestionToGame(ctx context.Context, gameID, questionID primitive.ObjectID) error {
	// Optional: add validation here (e.g. check if game/question exists)
	return s.gameRepo.AddQuestionToGame(ctx, gameID, questionID)
}
