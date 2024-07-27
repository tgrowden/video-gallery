package server

import (
	"log"
	"net/http"
	"runtime/debug"

	"video-dashboard/env"
	"video-dashboard/errors"
	"video-dashboard/server/handlers"
	"video-dashboard/server/write"

	"github.com/julienschmidt/httprouter"
)

func (srv *server) ConfigureRouter() {
	srv.router = httprouter.New()

	// setup error handlers for our router
	srv.router.MethodNotAllowed = write.Error(errors.BadRequestMethod)
	srv.router.NotFound = write.Error(errors.RouteNotFound)
	srv.router.PanicHandler = func(w http.ResponseWriter, r *http.Request, err interface{}) {
		log.Println("Panic on", r.URL.Path)
		debug.PrintStack()
		write.Error(errors.InternalError)(w, r)
	}

	// MOVIES
	srv.GET("/list-videos", handlers.ListVideos)
	srv.GET("/video/:id", handlers.GetVideoData)
	srv.POST("/video", handlers.UploadVideo)
	srv.GET("/play-video/:id", handlers.ServeVideo)
	srv.DELETE("/video/:id", handlers.DeleteVideo)
}

// srvHandler is the extended handler function that our API routes use
type srvHandler func(env env.Env, w http.ResponseWriter, r *http.Request) http.HandlerFunc

// helpers for easily adding routes
func (srv *server) GET(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodGet, path, srv.wrap(handler))
}
func (srv *server) PUT(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodPut, path, srv.wrap(handler))
}
func (srv *server) POST(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodPost, path, srv.wrap(handler))
}
func (srv *server) DELETE(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodDelete, path, srv.wrap(handler))
}

// wrap does all the middleware together
func (srv *server) wrap(h srvHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		fn := withEnv(srv.env, h, w, r)

		wrapped := csrf(cors(fn))

		wrapped(w, r)
	}
}
