from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InspectionViewSet, InspectionUploadView

router = DefaultRouter()
router.register(r'', InspectionViewSet, basename='inspection')

urlpatterns = [
    path('upload/', InspectionUploadView.as_view(), name='inspection-upload'),
    path('', include(router.urls)),
]
