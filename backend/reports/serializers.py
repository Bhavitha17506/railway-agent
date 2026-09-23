from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    inspection_code = serializers.CharField(source='inspection.inspection_code', read_only=True)
    track_section_code = serializers.CharField(source='inspection.track_section.section_code', read_only=True)
    track_section_name = serializers.CharField(source='inspection.track_section.name', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
