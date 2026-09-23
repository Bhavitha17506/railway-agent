from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HistoricalRecordViewSet, HistoricalComparisonViewSet

router = DefaultRouter()
router.register(r'records', HistoricalRecordViewSet, basename='historical-record')
router.register(r'comparisons', HistoricalComparisonViewSet, basename='historical-comparison')

urlpatterns = [
    path('', include(router.urls)),
]
