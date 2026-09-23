from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from core.models import TrackSection, Camera
from inspections.models import Inspection, Anomaly
from ai_engine.agents import MultiAgentOrchestrator
from ai_engine.deterioration import calculate_deterioration_index

User = get_user_model()

class RailGuardBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='test_admin', password='Password123!', role='ADMIN'
        )
        self.track = TrackSection.objects.create(
            section_code='TRK-999',
            name='Test Rail Corridor',
            deterioration_score=45
        )

    def test_auth_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'test_admin',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_dashboard_overview(self):
        response = self.client.get('/api/core/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('kpis', response.data)
        self.assertIn('agent_statuses', response.data)

    def test_deterioration_index_formula(self):
        result = calculate_deterioration_index(
            visual_severity='HIGH',
            sensor_deviation_pct=18.4,
            historical_growth_pct=85.7,
            days_since_maintenance=180
        )
        self.assertTrue(0 <= result['overall_score'] <= 100)
        self.assertIn('health_band', result)

    def test_multi_agent_orchestrator(self):
        results = MultiAgentOrchestrator.execute_full_pipeline(
            image_path_or_file=None,
            track_section=self.track,
            anomaly_hint='Surface Crack'
        )
        self.assertIn('vision_agent', results)
        self.assertIn('sensor_agent', results)
        self.assertIn('historical_agent', results)
        self.assertIn('deterioration_agent', results)
        self.assertIn('risk_agent', results)
        self.assertIn('priority_agent', results)
        self.assertIn('report_agent', results)
        self.assertEqual(len(results['agents_list']), 7)
