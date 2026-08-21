from rest_framework import serializers
from .models import Movie, Genre
from .utils import extract_youtube_video_id


class GenreSerializer(serializers.ModelSerializer):
    movies_count = serializers.IntegerField(source="movies.count", read_only=True)

    class Meta:
        model = Genre
        fields = ["id", "name", "slug", "description", "image", "movies_count", "created_at"]
        read_only_fields = ["slug", "created_at"]


class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    release_year = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "youtube_url",
            "youtube_video_id",
            "thumbnail",
            "backdrop",
            "genres",
            "release_date",
            "release_year",
            "duration",
            "rating",
            "is_featured",
            "is_trending",
            "is_popular",
            "is_published",
            "created_at",
        ]

    def get_release_year(self, obj):
        return obj.release_date.year if obj.release_date else None


class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Genre.objects.all(), source="genres", write_only=True, required=False
    )
    release_year = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "youtube_url",
            "youtube_video_id",
            "thumbnail",
            "backdrop",
            "genres",
            "genre_ids",
            "release_date",
            "release_year",
            "duration",
            "director",
            "writers",
            "cast",
            "language",
            "country",
            "rating",
            "is_featured",
            "is_trending",
            "is_popular",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "youtube_video_id", "created_at", "updated_at"]

    def get_release_year(self, obj):
        return obj.release_date.year if obj.release_date else None

    def validate_youtube_url(self, value):
        if value:
            video_id = extract_youtube_video_id(value)
            if not video_id:
                raise serializers.ValidationError("Invalid YouTube URL. Unable to extract video ID.")
        return value
