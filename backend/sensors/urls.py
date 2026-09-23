from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SensorReadingViewSet, SensorSimulatorView

router = DefaultRouter()
router.register(r'readings', SensorReadingViewSet, basename='sensor-reading')

urlpatterns = [
    path('simulate/', SensorSimulatorView.as_view(), name='sensor-simulate'),
    path('', include(router.urls)),
]
