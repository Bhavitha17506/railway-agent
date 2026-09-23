from rest_framework import serializers
from .models import TrackSection, Camera, CameraEvent

class CameraEventSerializer(serializers.ModelSerializer):
    formatted_time = serializers.SerializerMethodField()

    class Meta:
        model = CameraEvent
        fields = '__all__'

    def get_formatted_time(self, obj):
        return obj.timestamp.strftime('%H:%M:%S')

class CameraSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)
    track_section_name = serializers.CharField(source='track_section.name', read_only=True)
    track_health_status = serializers.CharField(source='track_section.health_status', read_only=True)
    track_deterioration_score = serializers.IntegerField(source='track_section.deterioration_score', read_only=True)
    events = CameraEventSerializer(many=True, read_only=True)
    sensor_telemetry = serializers.SerializerMethodField()

    class Meta:
        model = Camera
        fields = '__all__'

    def get_sensor_telemetry(self, obj):
        # Link real-time simulated sensor and risk baseline for section
        return {
            "vibration_pct": 82 if obj.has_anomaly else 24,
            "temperature_pct": 58 if obj.has_anomaly else 35,
            "stress_pct": 71 if obj.has_anomaly else 30,
            "acoustic_db": 86.4 if obj.has_anomaly else 64.2,
            "ai_risk": "HIGH" if obj.has_anomaly else "LOW",
            "deterioration_score": obj.track_section.deterioration_score
        }

class TrackSectionSerializer(serializers.ModelSerializer):
    cameras = CameraSerializer(many=True, read_only=True)
    health_status_display = serializers.CharField(source='get_health_status_display', read_only=True)
    line_type_display = serializers.CharField(source='get_line_type_display', read_only=True)

    class Meta:
        model = TrackSection
        fields = '__all__'

class TrackSectionSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackSection
        fields = ['id', 'section_code', 'name', 'health_status', 'deterioration_score', 'latitude', 'longitude']
