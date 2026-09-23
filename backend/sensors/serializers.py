from rest_framework import serializers
from .models import SensorReading, SensorBaseline

class SensorBaselineSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)

    class Meta:
        model = SensorBaseline
        fields = '__all__'

class SensorReadingSerializer(serializers.ModelSerializer):
    track_section_code = serializers.CharField(source='track_section.section_code', read_only=True)

    class Meta:
        model = SensorReading
        fields = '__all__'
