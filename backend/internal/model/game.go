package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Game struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID      string               `json:"user_id"`
	Name        string               `json:"name"`
	QuestionIDs []primitive.ObjectID `json:"question_ids" bson:"question_ids"`
}
