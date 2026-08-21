import os
import django
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from movies.models import Movie, Genre
from movies.utils import extract_youtube_video_id

# Test 1: YouTube ID Extractor
test_urls = [
    ("https://www.youtube.com/watch?v=YoHD9XEInc0", "YoHD9XEInc0"),
    ("https://youtu.be/zSWdZVtXT7E", "zSWdZVtXT7E"),
    ("https://www.youtube.com/embed/EXeTwQWrcwY", "EXeTwQWrcwY"),
    ("https://www.youtube.com/shorts/cqGjhVJWtEg", "cqGjhVJWtEg"),
    ("Way9Dexny3w", "Way9Dexny3w"),
]

for url, expected in test_urls:
    res = extract_youtube_video_id(url)
    assert res == expected, f"Failed {url}: got {res}, expected {expected}"
print("YouTube extractor test: PASSED")

# Test 2: Database objects count
movie_count = Movie.objects.count()
genre_count = Genre.objects.count()
assert movie_count >= 12, f"Expected at least 12 movies, got {movie_count}"
assert genre_count >= 10, f"Expected at least 10 genres, got {genre_count}"
print(f"Database check: PASSED ({movie_count} movies, {genre_count} genres)")

# Test 3: Relationships and serialization
movie = Movie.objects.first()
assert movie.genres.count() > 0, "Movie should have genres"
assert movie.youtube_video_id != "", "Movie should have youtube_video_id"
print(f"Sample movie '{movie.title}' (slug: {movie.slug}, video: {movie.youtube_video_id}): PASSED")
