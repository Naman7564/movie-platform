# Filmora — Modern Cinematic Movie Platform

Filmora is a full-stack movie discovery and streaming web application built with **React 19 + TypeScript + Vite** on the frontend and **Django 6 + Django REST Framework** on the backend with SQLite3 and Docker.

---

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Axios, React Router v7
* **Backend:** Python 3.12/3.14, Django 6, Django REST Framework, Django CORS Headers, Pillow
* **Database:** SQLite3 with persistent Docker volumes
* **Containerization:** Docker, Docker Compose, Nginx Alpine

---

## Features

* **Cinematic Dark UI/UX:** Translucent glassmorphism cards, gradients, and typography inspired by modern streaming platforms.
* **Dynamic Hero Showcase:** Rotates featured films with backdrops, ratings, runtime, genre tags, and quick actions.
* **YouTube Video Player:** Extracts and normalizes video IDs from any YouTube URL and embeds the official responsive player.
* **Movie Catalog & Live Search:** Debounced instant query search against Django API endpoints.
* **Multi-criteria Filtering & Sorting:** Filter by genre, release year, minimum rating, and sort order with deep URL sync.
* **My List / Watchlist:** Saved movies stored via localStorage context.
* **Admin Management Portal:** Full Django admin suite with poster previews, filter horizontals, flags (`is_featured`, `is_trending`, `is_popular`, `is_published`), and file uploads.
* **Seeded Data:** Built-in management command `seed_movies` with 12 popular films and 10 genres.

---

## Project Structure

```text
movie-platform/
├── backend/
│   ├── config/             # Django settings, WSGI, URLs
│   ├── movies/             # Models, serializers, views, admin, utils, management commands
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Hero, Navbar, MovieCard, MovieCarousel, MovieGrid, YouTubePlayer, SearchBar, Skeleton, Footer
│   │   ├── pages/          # Home, Movies, MovieDetails, Genres, Trending, Popular, MyList, About, Contact
│   │   ├── services/       # Centralized REST API client
│   │   ├── context/        # MyListContext
│   │   ├── types/          # TypeScript data contracts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
├── README.md
└── .gitignore
```

---

## Getting Started

### 1. Run with Docker Compose (Recommended)

```bash
docker compose up --build
```

The application will be accessible at:
* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend REST API:** [http://localhost:8000/api/](http://localhost:8000/api/)
* **Django Admin Portal:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

Create a superuser to log into the admin portal:

```bash
docker compose exec backend python manage.py createsuperuser
```

---

### 2. Run Locally without Docker

#### Backend Setup:

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_movies
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on [http://localhost:3000](http://localhost:3000).

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies/` | Paginated movie catalog (supports `?genre=`, `?year=`, `?min_rating=`, `?ordering=`) |
| `GET` | `/api/movies/:slug/` | Movie details with full cast and metadata |
| `GET` | `/api/movies/featured/` | Featured movies for Hero carousel |
| `GET` | `/api/movies/trending/` | Trending movies list |
| `GET` | `/api/movies/popular/` | Popular movies list |
| `GET` | `/api/movies/latest/` | Latest added movies |
| `GET` | `/api/movies/search/?q=term` | Debounced movie search |
| `GET` | `/api/genres/` | All available genres with movie counts |
| `GET` | `/api/genres/:slug/` | Genre detail |
| `POST/PUT/DELETE` | `/api/movies/` | Admin authenticated CRUD operations |

---

## Adding Movies via Django Admin

1. Open `http://localhost:8000/admin/` and log in with your superuser credentials.
2. Under **Movies**, click **Add Movie**.
3. Fill in:
   * **Title** (e.g. *Interstellar*)
   * **YouTube URL** (e.g. `https://www.youtube.com/watch?v=zSWdZVtXT7E` or `https://youtu.be/zSWdZVtXT7E`)
   * **Description**, **Release Date**, **Duration**, **Rating**, **Director**, **Cast**
   * **Genres** (choose one or more)
   * Check **Is Featured**, **Is Trending**, or **Is Popular**
   * Upload **Thumbnail** (poster) and **Backdrop**
4. Click **Save**. The movie will instantly appear on the React frontend.

---

## YouTube URL Support

The backend utility automatically parses standard formats:
* `https://www.youtube.com/watch?v=VIDEO_ID`
* `https://youtu.be/VIDEO_ID`
* `https://www.youtube.com/embed/VIDEO_ID`
* `https://www.youtube.com/shorts/VIDEO_ID`
