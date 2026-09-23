from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from accounts.views import MeView, MePermissionsView, MeAssignedSectionsView, MeDashboardView
from core.views import CameraViewSet
from rest_framework.routers import DefaultRouter

camera_router = DefaultRouter()
camera_router.register(r'', CameraViewSet, basename='direct-camera')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/me/', MeView.as_view(), name='direct-me'),
    path('api/me/permissions/', MePermissionsView.as_view(), name='direct-me-permissions'),
    path('api/me/assigned-sections/', MeAssignedSectionsView.as_view(), name='direct-me-assigned-sections'),
    path('api/me/dashboard/', MeDashboardView.as_view(), name='direct-me-dashboard'),
    path('api/cameras/', include(camera_router.urls)),
    path('api/core/', include('core.urls')),
    path('api/inspections/', include('inspections.urls')),
    path('api/anomalies/', include('anomalies.urls')),
    path('api/sensors/', include('sensors.urls')),
    path('api/history/', include('history.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/audit/', include('audit.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
