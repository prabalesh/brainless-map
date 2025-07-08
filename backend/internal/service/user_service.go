package service

import (
	"context"

	"github.com/prabalesh/brainless-map/backend/internal/model"
	"github.com/prabalesh/brainless-map/backend/internal/repository"
	"github.com/prabalesh/brainless-map/backend/internal/utils"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo}
}

func (s *UserService) CreateUser(ctx context.Context, user *model.User) error {
	user.SessionID = utils.GenerateSessionID()
	return s.repo.CreateUser(ctx, user)
}
