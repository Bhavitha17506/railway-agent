from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AIAnalyzeView, AIPredictionViewSet, DeteriorationScoreViewSet,
    InspectionPriorityViewSet, ModelMetricView, AgentCatalogView
)

router = DefaultRouter()
router.register(r'predictions', AIPredictionViewSet, basename='ai-prediction')
router.register(r'deteriorations', DeteriorationScoreViewSet, basename='deterioration-score')
router.register(r'priorities', InspectionPriorityViewSet, basename='inspection-priority')

urlpatterns = [
    path('analyze/', AIAnalyzeView.as_view(), name='ai-analyze'),
    path('metrics/', ModelMetricView.as_view(), name='ai-metrics'),
    path('agents/', AgentCatalogView.as_view(), name='agent-catalog'),
    path('', include(router.urls)),
]
