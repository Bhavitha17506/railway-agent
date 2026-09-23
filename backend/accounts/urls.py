from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, LogoutView, MeView, MePermissionsView, MeAssignedSectionsView, MeDashboardView, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('me/permissions/', MePermissionsView.as_view(), name='auth-me-permissions'),
    path('me/assigned-sections/', MeAssignedSectionsView.as_view(), name='auth-me-assigned-sections'),
    path('me/dashboard/', MeDashboardView.as_view(), name='auth-me-dashboard'),
    path('', include(router.urls)),
]
