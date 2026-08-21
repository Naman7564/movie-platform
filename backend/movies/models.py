from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from .utils import extract_youtube_video_id


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="genres/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    youtube_url = models.URLField(max_length=500)
    youtube_video_id = models.CharField(max_length=20, blank=True, db_index=True)
    thumbnail = models.ImageField(upload_to="movies/thumbnails/", blank=True, null=True)
    backdrop = models.ImageField(upload_to="movies/backdrops/", blank=True, null=True)
    genres = models.ManyToManyField(Genre, related_name="movies", blank=True)
    release_date = models.DateField(null=True, blank=True, db_index=True)
    duration = models.CharField(max_length=50, default="2h 00m", help_text="e.g. 2h 15m")
    director = models.CharField(max_length=255, blank=True)
    writers = models.CharField(max_length=255, blank=True)
    cast = models.TextField(blank=True, help_text="Comma-separated cast members")
    language = models.CharField(max_length=100, default="English")
    country = models.CharField(max_length=100, default="United States")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=7.5, db_index=True)

    is_featured = models.BooleanField(default=False, db_index=True)
    is_trending = models.BooleanField(default=False, db_index=True)
    is_popular = models.BooleanField(default=False, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        video_id = extract_youtube_video_id(self.youtube_url)
        if self.youtube_url and not video_id:
            raise ValidationError({"youtube_url": "Invalid YouTube URL or video ID could not be extracted."})
        self.youtube_video_id = video_id

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Movie.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        if self.youtube_url:
            self.youtube_video_id = extract_youtube_video_id(self.youtube_url)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
