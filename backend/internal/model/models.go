package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SessionID string             `json:"session_id"`
	Name      string             `json:"name"`
}

type Game struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID      string               `json:"user_id"`
	Name        string               `json:"name"`
	QuestionIDs []primitive.ObjectID `json:"question_ids" bson:"question_ids"`
}

type Question struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Word      string             `json:"word"`
	ImageURLs []string           `json:"image_urls"`
}
