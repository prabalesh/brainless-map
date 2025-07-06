package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/prabalesh/brainless-map/backend/internal/config"
	"github.com/prabalesh/brainless-map/backend/internal/handler"
	"github.com/rs/cors"
)

func main() {
	godotenv.Load()

	db := config.ConnectMongo()
	h := handler.NewHandler(db)

	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

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
