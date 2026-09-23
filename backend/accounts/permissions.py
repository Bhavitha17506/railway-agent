from rest_framework import permissions
from .models import UserRole

class IsAdminUserRole(permissions.BasePermission):
    """Allows access only to Admin users or superusers."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == UserRole.ADMIN or request.user.is_superuser))

class IsEngineerOrAdmin(permissions.BasePermission):
    """Allows access to Engineers and Admins."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER])

class IsInspectorOrAbove(permissions.BasePermission):
    """Allows access to Inspectors, Engineers, and Admins."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.INSPECTOR])

class IsMaintenanceOrAbove(permissions.BasePermission):
    """Allows access to Maintenance team, Engineers, and Admins."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.MAINTENANCE])

class CanReviewFindings(permissions.BasePermission):
    """Only Engineers and Admins can confirm/reject AI findings or add engineering comments."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER])

class CanCreateInspection(permissions.BasePermission):
    """Inspectors, Engineers, and Admins can upload inspections/evidence."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.INSPECTOR])

class CanUpdateMaintenance(permissions.BasePermission):
    """Maintenance Team, Engineers, and Admins can update work orders and maintenance status."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [UserRole.ADMIN, UserRole.ENGINEER, UserRole.MAINTENANCE])

class ReadOnlyPermission(permissions.BasePermission):
    """Allows SAFE methods for all authenticated users; mutating methods strictly gated."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.method in permissions.SAFE_METHODS

class ReadOnlyOrEngineer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in [UserRole.ADMIN, UserRole.ENGINEER]

class RoleBasedAccess(permissions.BasePermission):
    """
    Dynamically checks if user role matches action-level permission configurations.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == UserRole.ADMIN or request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.role == UserRole.VIEWER:
            return False
        return True

