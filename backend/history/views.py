from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import HistoricalRecord, HistoricalComparison
from .serializers import HistoricalRecordSerializer, HistoricalComparisonSerializer
from core.models import TrackSection

class HistoricalRecordViewSet(viewsets.ModelViewSet):
    queryset = HistoricalRecord.objects.all().select_related('track_section', 'inspection').order_by('-recorded_date')
    serializer_class = HistoricalRecordSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['track_section__section_code', 'anomaly_category', 'severity', 'metric_name']
    ordering_fields = ['recorded_date', 'measured_value_mm', 'deterioration_index_at_time']

    def get_queryset(self):
        qs = super().get_queryset()
        section_param = self.request.query_params.get('track_section')
        category_param = self.request.query_params.get('anomaly_category')
        if section_param:
            qs = qs.filter(track_section__section_code__icontains=section_param)
        if category_param:
            qs = qs.filter(anomaly_category=category_param)
        return qs

class HistoricalComparisonViewSet(viewsets.ModelViewSet):
    queryset = HistoricalComparison.objects.all().select_related('track_section', 'baseline_record', 'current_record').order_by('-created_at')
    serializer_class = HistoricalComparisonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        section_param = self.request.query_params.get('track_section')
        if section_param:
            qs = qs.filter(track_section__section_code__icontains=section_param)
        return qs
