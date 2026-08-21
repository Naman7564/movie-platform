from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow public GET/HEAD/OPTIONS requests.
    Require admin status for write operations (POST/PUT/PATCH/DELETE).
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
