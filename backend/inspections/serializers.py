from rest_framework import serializers
from .models import Inspection, InspectionMedia, Anomaly, Evidence
from core.serializers import TrackSectionSerializer

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = '__all__'

class AnomalySerializer(serializers.ModelSerializer):
    evidence = EvidenceSerializer(read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)

    class Meta:
        model = Anomaly
        fields = '__all__'

class InspectionMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspectionMedia
        fields = '__all__'

class InspectionListSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)
    track_section_name = serializers.CharField(source='track_section.name', read_only=True)
    inspector_name = serializers.CharField(source='inspector.get_full_name', read_only=True)
    anomalies_count = serializers.IntegerField(source='anomalies.count', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    risk_level_display = serializers.CharField(source='get_risk_level_display', read_only=True)

    class Meta:
        model = Inspection
        fields = [
            'id', 'inspection_code', 'track_section', 'track_section_code',
            'track_section_name', 'inspector', 'inspector_name', 'inspection_date',
            'source', 'status', 'status_display', 'risk_level', 'risk_level_display',
            'ai_confidence', 'anomalies_count', 'created_at'
        ]

class InspectionDetailSerializer(serializers.ModelSerializer):
    track_section = TrackSectionSerializer(read_only=True)
    inspector_name = serializers.CharField(source='inspector.get_full_name', read_only=True)
    media_files = InspectionMediaSerializer(many=True, read_only=True)
    anomalies = AnomalySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    risk_level_display = serializers.CharField(source='get_risk_level_display', read_only=True)

    class Meta:
        model = Inspection
        fields = '__all__'
