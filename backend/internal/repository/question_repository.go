package repository

import (
	"context"
	"time"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuestionRepository struct {
	col *mongo.Collection
}

func NewQuestionRepository(db *mongo.Database) *QuestionRepository {
	return &QuestionRepository{db.Collection("questions")}
}

func (r *QuestionRepository) CreateQuestion(ctx context.Context, q *model.Question) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	res, err := r.col.InsertOne(ctx, q)
	if err != nil {
		return err
	}
	q.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *QuestionRepository) GetAll(ctx context.Context) ([]model.Question, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := r.col.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	var questions []model.Question
	err = cursor.All(ctx, &questions)
	return questions, err
}

func (r *QuestionRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*model.Question, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var q model.Question
	err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&q)
	if err != nil {
		return nil, err
	}
	return &q, nil
}

func (r *QuestionRepository) GetByIDs(ctx context.Context, ids []primitive.ObjectID) ([]model.Question, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := r.col.Find(ctx, bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		return nil, err
	}

	var questions []model.Question
	err = cursor.All(ctx, &questions)
	return questions, err
}
