from rest_framework import serializers
from .models import User, UserRole

class AssignedSectionSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    section_code = serializers.CharField()
    name = serializers.CharField()
    health_status = serializers.CharField()
    deterioration_score = serializers.IntegerField()

class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    permissions = serializers.SerializerMethodField()
    assigned_sections_data = serializers.SerializerMethodField()
    assigned_section_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'badge_id', 'department',
            'phone_number', 'is_active', 'created_at', 'last_login',
            'assigned_sections', 'assigned_sections_data', 'assigned_section_count',
            'permissions'
        ]
        read_only_fields = ['id', 'created_at', 'last_login', 'permissions', 'assigned_sections_data', 'assigned_section_count']

    def get_permissions(self, obj):
        return obj.get_permissions_list()

    def get_assigned_sections_data(self, obj):
        return [
            {
                "id": s.id,
                "section_code": s.section_code,
                "name": s.name,
                "health_status": s.health_status,
                "deterioration_score": s.deterioration_score,
                "max_speed_kmh": s.max_speed_kmh
            }
            for s in obj.assigned_sections.all()
        ]

    def get_assigned_section_count(self, obj):
        return obj.assigned_sections.count()

class UserCreateUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'badge_id', 'department', 'phone_number', 'is_active'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_password('RailGuard123!')
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
