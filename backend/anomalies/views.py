from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from inspections.models import Anomaly
from inspections.serializers import AnomalySerializer

class AnomalyViewSet(viewsets.ModelViewSet):
    queryset = Anomaly.objects.all().select_related('inspection', 'inspection__track_section', 'evidence').order_by('-created_at')
    serializer_class = AnomalySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['anomaly_type', 'severity', 'inspection__inspection_code', 'inspection__track_section__section_code']
    ordering_fields = ['confidence', 'created_at', 'severity']

    def get_queryset(self):
        qs = super().get_queryset()
        type_param = self.request.query_params.get('anomaly_type')
        severity_param = self.request.query_params.get('severity')
        section_param = self.request.query_params.get('track_section')

        if type_param:
            qs = qs.filter(anomaly_type=type_param)
        if severity_param:
            qs = qs.filter(severity=severity_param)
        if section_param:
            qs = qs.filter(inspection__track_section__section_code__icontains=section_param)
        return qs
