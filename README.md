# Video Gallery

A simple Dockerized video gallery: Golang backend, React Frontend.

## Features and Stack

### Back-end
- [sqlc](https://github.com/kyleconroy/sqlc) for auto-generated sql bindings
- Simple [default middleware for CORS, CSRF, cookie parsing, etc](./golang/server/middleware.go).
- [httprouter](github.com/julienschmidt/httprouter) for [simple back-end routing](./golang/server/routes.go)

### Front-end
- [Vite](https://vitejs.dev/) dev server
- [Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/overview) for front-end routing
- [Tailwind CSS](https://tailwindcss.com/) for styling.

## Requirements
Install `docker` && `docker-compose`

## Quick Start
```bash
# copy the .env template for your local version
cp .env.example .env

docker-compose up
```
1) Visit `http://localhost:8080`
