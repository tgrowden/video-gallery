package handlers

import (
	"io"
	"net/http"
	"os"
	"path"
	"strconv"

	"video-dashboard/db"
	"video-dashboard/env"
	"video-dashboard/errors"
	"video-dashboard/server/write"
)

var FILE_UPLOAD_PATH = "video-uploads"

// Gets the directory of the video file
func getLocalVideoDir(id int64) string {
	return strconv.FormatInt(id, 10)
}

// Gets the name of the local video file
func getLocalVideoName(filename string) string {
	return "video" + path.Ext(filename)
}

// The handler used for uploading a video via a POST request
func UploadVideo(env env.Env, res http.ResponseWriter, req *http.Request) http.HandlerFunc {
	// limit upload size to 10M
	req.Body = http.MaxBytesReader(res, req.Body, 10*1024*1024)

	file, fileHeader, err := req.FormFile("video")

	title := req.FormValue("title")
	description := req.FormValue("description")

	if err != nil {
		return write.Error(err)
	}
	defer file.Close()

	// Create the upload file
	tempFile, err := os.CreateTemp(FILE_UPLOAD_PATH, "upload-*")

	if err != nil {
		return write.Error(err)
	}
	defer tempFile.Close()

	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := io.ReadAll(file)

	if err != nil {
		return write.Error(err)
	}

	// write this byte array to our temporary file
	tempFile.Write(fileBytes)

	video, err := env.DB().CreateVideo(req.Context(), db.CreateVideoParams{
		Title:       title,
		Description: description,
		Filename:    fileHeader.Filename,
	})

	if err != nil {
		return write.Error(err)
	}

	dirname := path.Join(FILE_UPLOAD_PATH, getLocalVideoDir(video.ID))
	os.Mkdir(dirname, 0777)

	err = os.Rename(tempFile.Name(), path.Join(dirname, getLocalVideoName(video.Filename)))

	if err != nil {
		return write.Error(err)
	}

	return write.JSON(video)
}

// Deletes a video, including removing the directory containing the video from the filesystem
func DeleteVideo(env env.Env, res http.ResponseWriter, req *http.Request) http.HandlerFunc {
	id, err := getIDRouteParam(req)

	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	video, err := env.DB().FindVideoByID(req.Context(), id)

	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.EntityNotFound)
		}
		return write.Error(err)
	}

	videoDir := path.Join(FILE_UPLOAD_PATH, getLocalVideoDir(video.ID))

	os.RemoveAll(videoDir)

	_, err = env.DB().DeleteVideo(req.Context(), video.ID)

	if err != nil {
		return write.Error(err)
	}

	return write.JSON(video)
}

// Returns a list of videos
func ListVideos(env env.Env, res http.ResponseWriter, req *http.Request) http.HandlerFunc {
	return write.JSONorErr(env.DB().GetVideos(req.Context()))
}

// Get the fields on a specific video by ID
func GetVideoData(env env.Env, res http.ResponseWriter, req *http.Request) http.HandlerFunc {
	id, err := getIDRouteParam(req)

	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	video, err := env.DB().FindVideoByID(req.Context(), id)

	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.EntityNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(video)
}

// Serves the video file
func ServeVideo(env env.Env, res http.ResponseWriter, req *http.Request) http.HandlerFunc {
	id, err := getIDRouteParam(req)

	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	video, err := env.DB().FindVideoByID(req.Context(), id)

	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.EntityNotFound)
		}
		return write.Error(err)
	}

	videoFile := path.Join(FILE_UPLOAD_PATH, getLocalVideoDir(video.ID), getLocalVideoName(video.Filename))

	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(res, req, videoFile)
	}
}
