from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
import random

from .models import Inspection, InspectionMedia, Anomaly, Evidence, InspectionStatus, RiskLevel
from .serializers import InspectionListSerializer, InspectionDetailSerializer, AnomalySerializer, InspectionMediaSerializer
from core.models import TrackSection

class InspectionViewSet(viewsets.ModelViewSet):
    queryset = Inspection.objects.all().select_related('track_section', 'inspector').prefetch_related('anomalies', 'media_files')
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['inspection_code', 'track_section__section_code', 'track_section__name', 'status', 'risk_level']
    ordering_fields = ['inspection_date', 'ai_confidence', 'risk_level', 'status']
    ordering = ['-inspection_date']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return InspectionDetailSerializer
        return InspectionListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        risk_param = self.request.query_params.get('risk_level')
        track_param = self.request.query_params.get('track_section')

        if status_param:
            qs = qs.filter(status=status_param)
        if risk_param:
            qs = qs.filter(risk_level=risk_param)
        if track_param:
            qs = qs.filter(track_section__section_code__icontains=track_param)
        return qs

class InspectionUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [AllowAny]

    def post(self, request):
        file_obj = request.FILES.get('file')
        track_section_id = request.data.get('track_section_id')
        source = request.data.get('source', 'MANUAL')
        notes = request.data.get('notes', 'Field media upload for automated AI processing')

        track = None
        if track_section_id:
            try:
                track = TrackSection.objects.get(id=track_section_id)
            except (TrackSection.DoesNotExist, ValueError):
                try:
                    track = TrackSection.objects.get(section_code=str(track_section_id).upper())
                except TrackSection.DoesNotExist:
                    track = TrackSection.objects.first()
        else:
            track = TrackSection.objects.first()

        if not track:
            track = TrackSection.objects.create(
                section_code="TRK-014",
                name="Northern Valley Mainline KP 14.2",
                health_status="HIGH",
                deterioration_score=68
            )

        # Generate unique inspection code
        inspection_code = f"INS-2026-{random.randint(1000, 9999)}"
        inspector = request.user if request.user.is_authenticated else None

        inspection = Inspection.objects.create(
            inspection_code=inspection_code,
            track_section=track,
            inspector=inspector,
            source=source,
            status=InspectionStatus.PROCESSING,
            notes=notes
        )

        media_type = 'video' if file_obj and any(file_obj.name.lower().endswith(ext) for ext in ['.mp4', '.avi', '.mov', '.mkv']) else 'image'
        
        media_instance = None
        if file_obj:
            media_instance = InspectionMedia.objects.create(
                inspection=inspection,
                media_file=file_obj,
                media_type=media_type,
                filename=file_obj.name,
                file_size_bytes=file_obj.size
            )

        return Response({
            "inspection": InspectionDetailSerializer(inspection).data,
            "media_id": media_instance.id if media_instance else None,
            "message": "Inspection uploaded successfully. Ready for AI multi-agent analysis."
        }, status=status.HTTP_201_CREATED)
