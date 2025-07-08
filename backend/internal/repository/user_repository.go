package repository

import (
	"context"
	"time"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	col *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *UserRepository {
	return &UserRepository{db.Collection("users")}
}

func (r *UserRepository) CreateUser(ctx context.Context, user *model.User) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	res, err := r.col.InsertOne(ctx, user)
	if err != nil {
		return err
	}
	user.ID = res.InsertedID.(primitive.ObjectID)
	return nil
}
