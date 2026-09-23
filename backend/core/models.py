from django.db import models

class TrackHealthStatus(models.TextChoices):
    HEALTHY = 'HEALTHY', 'Healthy (0-24)'
    NORMAL = 'NORMAL', 'Normal Wear (25-49)'
    WATCH = 'WATCH', 'Watch / Elevated (50-74)'
    HIGH = 'HIGH', 'High Priority (75-89)'
    CRITICAL = 'CRITICAL', 'Critical Attention (90-100)'

class LineType(models.TextChoices):
    MAIN_LINE = 'MAIN_LINE', 'Main Passenger Line'
    HIGH_SPEED = 'HIGH_SPEED', 'High Speed Rail'
    FREIGHT_CORRIDOR = 'FREIGHT_CORRIDOR', 'Heavy Freight Corridor'
    SUBURBAN = 'SUBURBAN', 'Suburban Transit'
    SWITCH_YARD = 'SWITCH_YARD', 'Switching & Marshalling Yard'

class TrackSection(models.Model):
    section_code = models.CharField(max_length=30, unique=True, help_text="e.g. TRK-001, TRK-014")
    name = models.CharField(max_length=150, help_text="e.g. Northern Valley Mainline Segment 14")
    line_type = models.CharField(max_length=40, choices=LineType.choices, default=LineType.MAIN_LINE)
    start_km = models.DecimalField(max_digits=8, decimal_places=3, default=0.000, help_text="Start kilometer marker")
    end_km = models.DecimalField(max_digits=8, decimal_places=3, default=1.000, help_text="End kilometer marker")
    latitude = models.DecimalField(max_digits=10, decimal_places=6, default=37.774900)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, default=-122.419400)
    health_status = models.CharField(max_length=30, choices=TrackHealthStatus.choices, default=TrackHealthStatus.HEALTHY)
    deterioration_score = models.IntegerField(default=15, help_text="Composite Index 0 - 100")
    max_speed_kmh = models.IntegerField(default=160, help_text="Current rated track speed limit")
    electrified = models.BooleanField(default=True)
    ballast_type = models.CharField(max_length=80, default="Crushed Granite Ballast")
    sleeper_type = models.CharField(max_length=80, default="Prestressed Concrete Sleeper B70")
    rail_profile = models.CharField(max_length=50, default="UIC 60 / 60E1")
    last_inspection_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['section_code']

    def __str__(self):
        return f"{self.section_code} - {self.name} [{self.health_status}]"

class CameraStatus(models.TextChoices):
    LIVE = 'LIVE', '● LIVE'
    ONLINE = 'ONLINE', '● ONLINE'
    OFFLINE = 'OFFLINE', '○ OFFLINE'
    CONNECTING = 'CONNECTING', '◐ CONNECTING'
    RECONNECTING = 'RECONNECTING', '↻ RECONNECTING'

class Camera(models.Model):
    camera_code = models.CharField(max_length=30, unique=True, help_text="e.g. CAM-014")
    track_section = models.ForeignKey(TrackSection, on_delete=models.CASCADE, related_name='cameras')
    name = models.CharField(max_length=120, default="Trackside Optical Sensor")
    camera_type = models.CharField(max_length=80, default="4K Optical Gantry Sensor")
    location_description = models.CharField(max_length=255, default="Overhead Gantry Station KP 14.2")
    km_marker = models.DecimalField(max_digits=8, decimal_places=2, default=14.20)
    resolution = models.CharField(max_length=20, default="1080p 60fps")
    fps = models.IntegerField(default=60)
    signal_quality = models.CharField(max_length=30, default="Good")
    status = models.CharField(max_length=20, choices=CameraStatus.choices, default=CameraStatus.LIVE)
    stream_url = models.CharField(max_length=255, blank=True, null=True, default="simulated://feed/cam-014")
    is_active = models.BooleanField(default=True)
    has_anomaly = models.BooleanField(default=False)
    anomaly_label = models.CharField(max_length=100, blank=True, null=True, default="Surface Crack")
    anomaly_confidence = models.FloatField(default=0.947)
    anomaly_severity = models.CharField(max_length=20, default="HIGH")
    last_heartbeat = models.DateTimeField(auto_now=True)
    firmware_version = models.CharField(max_length=40, default="v2.4.1-edge")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['camera_code']

    def __str__(self):
        return f"{self.camera_code} ({self.track_section.section_code}) [{self.status}]"

class CameraEvent(models.Model):
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50, default="ANOMALY_DETECTED")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(max_length=20, default="INFO")
    frame_snapshot_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.camera.camera_code} - {self.title} ({self.timestamp.strftime('%H:%M:%S')})"
