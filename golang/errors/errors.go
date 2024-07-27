package errors

import (
	"errors"
	"net/http"
)

var (
	BadRequestMethod = errors.New(http.StatusText(http.StatusMethodNotAllowed))
	InternalError    = errors.New(http.StatusText(http.StatusInternalServerError))

	BadRequestBody       = errors.New("BadRequestBody")
	NoJSONBody           = errors.New("Unable to decode JSON")
	MissingRequiredField = errors.New("Missing required field")

	EntityNotFound = errors.New("Entity not found")

	BadCSRF       = errors.New("Missing CSRF Header")
	BadOrigin     = errors.New("Invalid Origin Header")
	RouteNotFound = errors.New("Route not found")
)

// codeMap returns a map of errors to http status codes
func codeMap() map[error]int {
	return map[error]int{
		BadRequestMethod: http.StatusMethodNotAllowed,
		InternalError:    http.StatusInternalServerError,

		BadRequestBody:       http.StatusBadRequest,
		NoJSONBody:           http.StatusBadRequest,
		MissingRequiredField: http.StatusBadRequest,

		EntityNotFound: http.StatusNotFound,

		BadCSRF:       http.StatusUnauthorized,
		BadOrigin:     http.StatusUnauthorized,
		RouteNotFound: http.StatusNotFound,
	}
}

// GetCode is a helper to get the relevant code for an error, or just return 500
func GetCode(e error) (bool, int) {
	if code, ok := codeMap()[e]; ok {
		return true, code
	}
	return false, http.StatusInternalServerError
}
