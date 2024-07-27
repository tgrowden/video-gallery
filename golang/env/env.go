package env

import (
	"video-dashboard/db/wrapper"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Env interface {
	DB() wrapper.Querier
	Close()
}

// default impl
type env struct {
	db      *pgxpool.Pool
	querier wrapper.Querier
}

func (e *env) DB() wrapper.Querier {
	return e.querier
}

func (e *env) Close() {
	e.db.Close()
}

func New() (Env, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	return &env{
		db:      db,
		querier: wrapper.NewQuerier(db),
	}, nil
}
