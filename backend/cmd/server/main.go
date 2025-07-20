package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/prabalesh/brainless-map/backend/internal/config"
	"github.com/prabalesh/brainless-map/backend/internal/handler"
	"github.com/prabalesh/brainless-map/backend/internal/repository"
	"github.com/prabalesh/brainless-map/backend/internal/service"
	"github.com/rs/cors"
)

func main() {
	godotenv.Load()

	db := config.ConnectMongo()

	mux := http.NewServeMux()

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	questionRepo := repository.NewQuestionRepository(db)
	questionService := service.NewQuestionService(questionRepo)
	questionHandler := handler.NewQuestionHandler(questionService)

	gameRepo := repository.NewGameRepository(db)
	gameService := service.NewGameService(gameRepo, questionRepo)
	gameHandler := handler.NewGameHandler(gameService)

	mux.HandleFunc("GET /api/games", gameHandler.HandleAllGames)
	mux.HandleFunc("POST /api/games", gameHandler.HandleCreateGame)
	mux.HandleFunc("GET /api/games/{id}/questions", gameHandler.HandleGetQuestionsByGame)
	mux.HandleFunc("POST /api/games/{id}/questions", gameHandler.HandleAddQuestionToGame)
	mux.HandleFunc("GET /api/images/search", gameHandler.HandleImageSearch)

	mux.HandleFunc("POST /api/users", userHandler.HandleCreateUser)

	mux.HandleFunc("GET /api/questions", questionHandler.HandleAllQuestions)
	mux.HandleFunc("POST /api/questions", questionHandler.HandleCreateQuestion)
	mux.HandleFunc("GET /api/questions/{id}", questionHandler.HandleGetQuestionByID)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{os.Getenv("FRONTEND_ORIGIN")},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	}).Handler(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
