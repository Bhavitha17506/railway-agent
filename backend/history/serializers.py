from rest_framework import serializers
from .models import HistoricalRecord, HistoricalComparison

class HistoricalRecordSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)
    track_section_name = serializers.CharField(source='track_section.name', read_only=True)

    class Meta:
        model = HistoricalRecord
        fields = '__all__'

class HistoricalComparisonSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)
    baseline_record = HistoricalRecordSerializer(read_only=True)
    current_record = HistoricalRecordSerializer(read_only=True)

    class Meta:
        model = HistoricalComparison
        fields = '__all__'
