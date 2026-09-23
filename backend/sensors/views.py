from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import SensorReading, SensorBaseline
from .serializers import SensorReadingSerializer, SensorBaselineSerializer
from .simulator import generate_live_sensor_data
from core.models import TrackSection

class SensorReadingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensorReading.objects.all().order_by('-timestamp')
    serializer_class = SensorReadingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        section_param = self.request.query_params.get('track_section')
        if section_param:
            qs = qs.filter(track_section__section_code__icontains=section_param)
        return qs[:50]

class SensorSimulatorView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        section_code = request.query_params.get('track_section', 'TRK-014')
        inject_anomaly = request.query_params.get('inject_anomaly', 'false').lower() == 'true'
        count = int(request.query_params.get('count', 20))

        try:
            track = TrackSection.objects.get(section_code=section_code)
        except TrackSection.DoesNotExist:
            track = TrackSection.objects.first()
            if not track:
                track = TrackSection.objects.create(
                    section_code=section_code,
                    name=f"Corridor {section_code}",
                    health_status="HIGH",
                    deterioration_score=68
                )

        baseline, _ = SensorBaseline.objects.get_or_create(track_section=track)
        data = generate_live_sensor_data(track, count=count, inject_anomaly=inject_anomaly)

        return Response({
            "track_section": {
                "id": track.id,
                "section_code": track.section_code,
                "name": track.name,
                "health_status": track.health_status,
                "deterioration_score": track.deterioration_score
            },
            "baseline": SensorBaselineSerializer(baseline).data,
            "readings": data,
            "simulation_active": True,
            "current_metrics": data[-1] if data else {},
            "status_banner": "NOTICE: Telemetry values are simulated for demo and verification purposes."
        })

    def post(self, request):
        action = request.data.get('action', 'START')
        section_code = request.data.get('track_section', 'TRK-014')
        inject = request.data.get('inject_anomaly', False)

        try:
            track = TrackSection.objects.get(section_code=section_code)
        except TrackSection.DoesNotExist:
            track = TrackSection.objects.first()

        data = generate_live_sensor_data(track, count=25, inject_anomaly=inject)

        return Response({
            "action": action,
            "status": "SIMULATION_UPDATED",
            "message": f"Sensor simulation '{action}' executed for section {section_code}.",
            "readings": data
        })
