from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrackSectionViewSet, CameraViewSet, DashboardOverviewView

router = DefaultRouter()
router.register(r'track-sections', TrackSectionViewSet, basename='track-section')
router.register(r'cameras', CameraViewSet, basename='camera')

urlpatterns = [
    path('dashboard/', DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('', include(router.urls)),
]
