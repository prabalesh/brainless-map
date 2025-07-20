package repository

import (
	"context"
	"time"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type GameRepository struct {
	col *mongo.Collection
}

func NewGameRepository(db *mongo.Database) *GameRepository {
	return &GameRepository{db.Collection("games")}
}

func (r *GameRepository) Create(ctx context.Context, game *model.Game) (primitive.ObjectID, error) {
	game.QuestionIDs = []primitive.ObjectID{}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	res, err := r.col.InsertOne(ctx, game)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return res.InsertedID.(primitive.ObjectID), nil
}

func (r *GameRepository) FindAll(ctx context.Context) ([]model.Game, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	cursor, err := r.col.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var games []model.Game
	err = cursor.All(ctx, &games)
	return games, err
}

func (r *GameRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*model.Game, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var game model.Game
	err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&game)
	if err != nil {
		return nil, err
	}
	return &game, nil
}

func (r *GameRepository) AddQuestionToGame(ctx context.Context, gameID, questionID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	_, err := r.col.UpdateByID(ctx, gameID, bson.M{
		"$addToSet": bson.M{"question_ids": questionID},
	})
	return err
}
