-- name: GetVideos :many
SELECT * FROM videos order by created_at DESC;

-- name: FindVideoByID :one
select * from videos where id = $1 limit 1;

-- name: CreateVideo :one
INSERT INTO videos (title, description, filename) VALUES ($1, $2, $3) RETURNING *;

-- name: DeleteVideo :one
DELETE from videos where id = $1 returning *;
