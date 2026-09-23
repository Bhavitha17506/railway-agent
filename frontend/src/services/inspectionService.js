import api from './api';
import { mockDashboardData, mockInspections, mockTrackSections, mockAnomalies, mockCameras, mockHistoricalComparisons } from './mockData';

export const inspectionService = {
  getDashboardOverview: async () => {
    try {
      const response = await api.get('/core/dashboard/');
      return response.data;
    } catch (error) {
      return mockDashboardData;
    }
  },

  getTrackSections: async (params = {}) => {
    try {
      const response = await api.get('/core/track-sections/', { params });
      return response.data.results || response.data;
    } catch (error) {
      return mockTrackSections;
    }
  },

  getTrackSectionById: async (id) => {
    try {
      const response = await api.get(`/core/track-sections/${id}/`);
      return response.data;
    } catch (error) {
      return mockTrackSections.find(t => t.id === Number(id) || t.section_code === id) || mockTrackSections[0];
    }
  },

  getCameras: async (params = {}) => {
    try {
      const response = await api.get('/cameras/', { params });
      return response.data.results || response.data;
    } catch (error) {
      return mockCameras;
    }
  },

  getCameraById: async (id) => {
    try {
      const response = await api.get(`/cameras/${id}/`);
      return response.data;
    } catch (error) {
      return mockCameras.find(c => c.id === Number(id) || c.camera_code === id) || mockCameras[0];
    }
  },

  analyzeCameraFrame: async (id) => {
    try {
      const response = await api.post(`/cameras/${id}/analyze/`);
      return response.data;
    } catch (error) {
      return {
        status: "ANALYSIS_COMPLETE",
        anomaly_detected: true,
        anomaly_type: "Surface Crack",
        confidence: 0.947,
        severity: "HIGH"
      };
    }
  },

  captureCameraFrame: async (id) => {
    try {
      const response = await api.post(`/cameras/${id}/capture/`);
      return response.data;
    } catch (error) {
      return {
        status: "CAPTURED",
        frame_id: `FRM-CAM-${Date.now().toString().slice(-4)}`
      };
    }
  },

  getCameraEvents: async (id) => {
    try {
      const response = await api.get(`/cameras/${id}/events/`);
      return response.data;
    } catch (error) {
      return [
        { id: 1, title: 'Surface anomaly detected', event_type: 'ANOMALY_DETECTED', formatted_time: '14:02:18', severity: 'HIGH' },
        { id: 2, title: 'Frame analyzed', event_type: 'AI_FRAME_ANALYZED', formatted_time: '14:01:52', severity: 'INFO' }
      ];
    }
  },

  getCameraHealth: async (id) => {
    try {
      const response = await api.get(`/cameras/${id}/health/`);
      return response.data;
    } catch (error) {
      return {
        signal_quality: "Good",
        fps: 60,
        resolution: "1080p 60fps",
        latency_ms: 14,
        packet_loss_pct: 0.02
      };
    }
  },

  getInspections: async (params = {}) => {
    try {
      const response = await api.get('/inspections/', { params });
      return response.data.results || response.data;
    } catch (error) {
      return mockInspections;
    }
  },

  getInspectionById: async (id) => {
    try {
      const response = await api.get(`/inspections/${id}/`);
      return response.data;
    } catch (error) {
      const found = mockInspections.find(i => i.id === Number(id)) || mockInspections[0];
      return {
        ...found,
        track_section: mockTrackSections.find(t => t.section_code === found.track_section_code) || mockTrackSections[0],
        anomalies: mockAnomalies.filter(a => a.inspection === found.id || a.track_section_code === found.track_section_code),
        media_files: [{ id: 1, media_type: 'image', filename: 'inspection_raw_01.jpg', file_size_bytes: 4200000 }]
      };
    }
  },

  uploadInspection: async (formData) => {
    try {
      const response = await api.post('/inspections/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      // Fallback
      return {
        inspection: {
          id: Math.floor(Math.random() * 900) + 100,
          inspection_code: `INS-2026-${Math.floor(Math.random() * 8999) + 1000}`,
          track_section: 14,
          track_section_code: "TRK-014",
          status: "AWAITING_REVIEW",
          risk_level: "HIGH",
          ai_confidence: 0.9470,
          inspection_date: new Date().toISOString()
        },
        media_id: 1,
        message: "Inspection uploaded and queued for AI analysis."
      };
    }
  },

  getAnomalies: async (params = {}) => {
    try {
      const response = await api.get('/anomalies/', { params });
      return response.data.results || response.data;
    } catch (error) {
      return mockAnomalies;
    }
  },

  getAnomalyById: async (id) => {
    try {
      const response = await api.get(`/anomalies/${id}/`);
      return response.data;
    } catch (error) {
      return mockAnomalies.find(a => a.id === Number(id)) || mockAnomalies[0];
    }
  },

  getHistoricalComparisons: async () => {
    try {
      const response = await api.get('/history/comparisons/');
      return response.data.results || response.data;
    } catch (error) {
      return mockHistoricalComparisons;
    }
  },

  getHistoricalRecords: async () => {
    try {
      const response = await api.get('/history/records/');
      return response.data.results || response.data;
    } catch (error) {
      return [
        { id: 1, track_section_code: "TRK-014", recorded_date: "2026-09-18", anomaly_category: "Surface Crack", severity: "HIGH", metric_name: "Crack Length", measured_value_mm: 7.8, deterioration_index_at_time: 68, engineer_decision: "CONFIRMED" },
        { id: 2, track_section_code: "TRK-014", recorded_date: "2026-03-20", anomaly_category: "Surface Crack", severity: "MEDIUM", metric_name: "Crack Length", measured_value_mm: 4.2, deterioration_index_at_time: 42, engineer_decision: "CONFIRMED" },
        { id: 3, track_section_code: "TRK-007", recorded_date: "2026-09-17", anomaly_category: "Rail Corrosion", severity: "MEDIUM", metric_name: "Corrosion Depth", measured_value_mm: 2.8, deterioration_index_at_time: 79, engineer_decision: "CONFIRMED" },
      ];
    }
  }
};
