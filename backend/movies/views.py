from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Movie, Genre
from .serializers import MovieListSerializer, MovieDetailSerializer, GenreSerializer
from .permissions import IsAdminOrReadOnly


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all().prefetch_related("movies")
    serializer_class = GenreSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.filter(is_published=True).prefetch_related("genres")
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    lookup_field = "slug"
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["release_date", "rating", "created_at", "title"]

    def get_queryset(self):
        # Staff users can view all movies including unpublished
        if self.request.user and self.request.user.is_staff:
            queryset = Movie.objects.all().prefetch_related("genres")
        else:
            queryset = Movie.objects.filter(is_published=True).prefetch_related("genres")

        genre_slug = self.request.query_params.get("genre")
        if genre_slug:
            queryset = queryset.filter(genres__slug__iexact=genre_slug)

        year = self.request.query_params.get("year")
        if year and year.isdigit():
            queryset = queryset.filter(release_date__year=int(year))

        min_rating = self.request.query_params.get("min_rating")
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except ValueError:
                pass

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action in ["retrieve", "create", "update", "partial_update"]:
            return MovieDetailSerializer
        return MovieListSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        movies = self.get_queryset().filter(is_featured=True)[:10]
        serializer = MovieListSerializer(movies, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def trending(self, request):
        movies = self.get_queryset().filter(is_trending=True).order_by("-rating", "-created_at")[:15]
        serializer = MovieListSerializer(movies, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def popular(self, request):
        movies = self.get_queryset().filter(is_popular=True).order_by("-rating")[:15]
        serializer = MovieListSerializer(movies, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def latest(self, request):
        movies = self.get_queryset().order_by("-release_date", "-created_at")[:15]
        serializer = MovieListSerializer(movies, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response({"count": 0, "results": []})

        movies = self.get_queryset().filter(
            Q(title__icontains=query)
            | Q(description__icontains=query)
            | Q(director__icontains=query)
            | Q(cast__icontains=query)
            | Q(genres__name__icontains=query)
        ).distinct()

        page = self.paginate_queryset(movies)
        if page is not None:
            serializer = MovieListSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = MovieListSerializer(movies, many=True, context={"request": request})
        return Response({"count": movies.count(), "results": serializer.data})
