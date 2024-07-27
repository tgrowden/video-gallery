package handlers

import (
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v4"
	"github.com/julienschmidt/httprouter"
)

// a helper for handling a not-found error
func isNotFound(err error) bool {
	return err == pgx.ErrNoRows
}

func getInt64RouteParam(name string, r *http.Request) (out int64, err error) {
	params := httprouter.ParamsFromContext(r.Context())
	arg := params.ByName(name)
	out, err = strconv.ParseInt(arg, 10, 64)
	return
}

func getIDRouteParam(r *http.Request) (out int64, err error) {
	return getInt64RouteParam("id", r)
}

// func getString(name string, r *http.Request) (param string) {
// 	params := httprouter.ParamsFromContext(r.Context())
// 	return params.ByName(name)
// }
