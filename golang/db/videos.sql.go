// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.15.0
// source: videos.sql

package db

import (
	"context"
)

const createVideo = `-- name: CreateVideo :one
INSERT INTO videos (title, description, filename) VALUES ($1, $2, $3) RETURNING id, title, description, created_at, filename
`

type CreateVideoParams struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Filename    string `json:"filename"`
}

func (q *Queries) CreateVideo(ctx context.Context, arg CreateVideoParams) (Video, error) {
	row := q.db.QueryRow(ctx, createVideo, arg.Title, arg.Description, arg.Filename)
	var i Video
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.CreatedAt,
		&i.Filename,
	)
	return i, err
}

const deleteVideo = `-- name: DeleteVideo :one
DELETE from videos where id = $1 returning id, title, description, created_at, filename
`

func (q *Queries) DeleteVideo(ctx context.Context, id int64) (Video, error) {
	row := q.db.QueryRow(ctx, deleteVideo, id)
	var i Video
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.CreatedAt,
		&i.Filename,
	)
	return i, err
}

const findVideoByID = `-- name: FindVideoByID :one
select id, title, description, created_at, filename from videos where id = $1 limit 1
`

func (q *Queries) FindVideoByID(ctx context.Context, id int64) (Video, error) {
	row := q.db.QueryRow(ctx, findVideoByID, id)
	var i Video
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Description,
		&i.CreatedAt,
		&i.Filename,
	)
	return i, err
}

const getVideos = `-- name: GetVideos :many
SELECT id, title, description, created_at, filename FROM videos order by created_at DESC
`

func (q *Queries) GetVideos(ctx context.Context) ([]Video, error) {
	rows, err := q.db.Query(ctx, getVideos)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Video{}
	for rows.Next() {
		var i Video
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.CreatedAt,
			&i.Filename,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}