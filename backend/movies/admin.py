from django.contrib import admin
from django.utils.html import format_html
from .models import Movie, Genre


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "movies_count", "created_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}

    def movies_count(self, obj):
        return obj.movies.count()
    movies_count.short_description = "Movies"


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "thumbnail_preview",
        "title",
        "release_date",
        "rating",
        "is_published",
        "is_featured",
        "is_trending",
        "is_popular",
        "youtube_video_id",
    )
    list_filter = (
        "is_published",
        "is_featured",
        "is_trending",
        "is_popular",
        "genres",
        "release_date",
    )
    search_fields = ("title", "description", "director", "cast", "writers")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("genres",)
    readonly_fields = ("youtube_video_id", "created_at", "updated_at", "thumbnail_preview_large")

    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "slug", "description", "genres", "rating")
        }),
        ("Media & Video", {
            "fields": (
                "youtube_url",
                "youtube_video_id",
                "thumbnail",
                "thumbnail_preview_large",
                "backdrop",
            )
        }),
        ("Details & Credits", {
            "fields": (
                "release_date",
                "duration",
                "director",
                "writers",
                "cast",
                "language",
                "country",
            )
        }),
        ("Visibility & Flags", {
            "fields": (
                "is_published",
                "is_featured",
                "is_trending",
                "is_popular",
            )
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="width: 48px; height: 64px; object-fit: cover; border-radius: 4px;" />',
                obj.thumbnail.url,
            )
        return "-"
    thumbnail_preview.short_description = "Poster"

    def thumbnail_preview_large(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 300px; object-fit: cover; border-radius: 8px;" />',
                obj.thumbnail.url,
            )
        return "No thumbnail uploaded"
    thumbnail_preview_large.short_description = "Current Poster Preview"
