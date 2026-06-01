package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/xuantumRek/kouho/backend/config"
	"github.com/xuantumRek/kouho/backend/models"
)

func GetVideos(c *gin.Context) {
	var videos []models.Video
	result := config.DB.Order("created_at desc").Find(&videos)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": videos, "total": len(videos)})
}

func GetVideo(c *gin.Context) {
	id := c.Param("id")
	var video models.Video
	result := config.DB.First(&video, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	// Generate pre-signed URL untuk video
	presignClient := s3.NewPresignClient(config.S3Client)
	req, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("S3_BUCKET")),
		Key:    aws.String(video.S3Key),
	}, s3.WithPresignExpires(15*time.Minute))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate video URL"})
		return
	}

	// Generate pre-signed URL untuk thumbnail jika ada
	thumbnailURL := ""
	if video.ThumbnailKey != "" {
		thumbReq, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
			Bucket: aws.String(os.Getenv("S3_BUCKET")),
			Key:    aws.String(video.ThumbnailKey),
		}, s3.WithPresignExpires(15*time.Minute))
		if err == nil {
			thumbnailURL = thumbReq.URL
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data":          video,
		"video_url":     req.URL,
		"thumbnail_url": thumbnailURL,
	})
}

func UploadVideo(c *gin.Context) {
	// Parse form
	title := c.PostForm("title")
	description := c.PostForm("description")
	source := c.PostForm("source")
	language := c.PostForm("language")

	if title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	// Upload file video
	videoFile, err := c.FormFile("video")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Video file is required"})
		return
	}

	videoSrc, err := videoFile.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open video file"})
		return
	}
	defer videoSrc.Close()

	s3VideoKey := fmt.Sprintf("videos/%d_%s", time.Now().Unix(), videoFile.Filename)

	_, err = config.S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(os.Getenv("S3_BUCKET")),
		Key:         aws.String(s3VideoKey),
		Body:        videoSrc,
		ContentType: aws.String(videoFile.Header.Get("Content-Type")),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload video to S3"})
		return
	}

	// Upload thumbnail jika ada
	thumbnailKey := ""
	thumbnailFile, err := c.FormFile("thumbnail")
	if err == nil {
		thumbSrc, err := thumbnailFile.Open()
		if err == nil {
			defer thumbSrc.Close()
			thumbnailKey = fmt.Sprintf("thumbnails/%d_%s", time.Now().Unix(), thumbnailFile.Filename)
			config.S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
				Bucket:      aws.String(os.Getenv("S3_BUCKET")),
				Key:         aws.String(thumbnailKey),
				Body:        thumbSrc,
				ContentType: aws.String(thumbnailFile.Header.Get("Content-Type")),
			})
		}
	}

	// Simpan ke DB
	video := models.Video{
		Title:        title,
		Description:  description,
		Source:       source,
		Language:     language,
		S3Key:        s3VideoKey,
		ThumbnailKey: thumbnailKey,
	}

	result := config.DB.Create(&video)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": video, "message": "Video uploaded successfully"})
}

func DeleteVideo(c *gin.Context) {
	id := c.Param("id")
	var video models.Video
	result := config.DB.First(&video, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	// Hapus dari S3
	config.S3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(os.Getenv("S3_BUCKET")),
		Key:    aws.String(video.S3Key),
	})

	// Hapus dari DB
	config.DB.Delete(&video)
	c.JSON(http.StatusOK, gin.H{"message": "Video deleted successfully"})
}