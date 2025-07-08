package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Question struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Word      string             `json:"word"`
	ImageURLs []string           `json:"image_urls"`
}
