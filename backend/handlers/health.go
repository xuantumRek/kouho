package handlers

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "kouho-backend",
	})
}

func Stress(c *gin.Context) {
	// CPU intensive task
	result := 0.0
	for i := 0; i < 1000000; i++ {
		result += math.Sqrt(float64(i))
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "stressed",
		"result": result,
	})
}