package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/xuantumRek/kouho/backend/config"
	"github.com/xuantumRek/kouho/backend/handlers"
)

func main() {
	// Load .env jika ada (development only)
	godotenv.Load()

	// Init DB
	config.InitDB()

	// Init S3
	config.InitS3()

	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
	}))

	// Routes
	api := r.Group("/api")
	{
		api.GET("/health", handlers.Health)
		api.GET("/stress", handlers.Stress)
		api.GET("/videos", handlers.GetVideos)
		api.GET("/videos/:id", handlers.GetVideo)
		api.POST("/videos", handlers.UploadVideo)
		api.DELETE("/videos/:id", handlers.DeleteVideo)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Kouho backend running on port %s", port)
	r.Run(":" + port)
}