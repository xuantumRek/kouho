package models

import "time"

type Video struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Source      string    `json:"source"`
	Language    string    `json:"language"`
	S3Key       string    `json:"s3_key" gorm:"not null"`
	ThumbnailKey string   `json:"thumbnail_key"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}