CREATE TABLE videos (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL default now(),
  filename varchar(500) NOT NULL
);
