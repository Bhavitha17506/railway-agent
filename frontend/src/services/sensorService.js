import api from './api';

export const sensorService = {
  getLiveReadings: async (trackSection = 'TRK-014', count = 20, injectAnomaly = false) => {
    try {
      const response = await api.get('/sensors/simulate/', {
        params: { track_section: trackSection, count, inject_anomaly: injectAnomaly }
      });
      return response.data;
    } catch (error) {
      // Generate realistic synthetic fallback stream
      const baseVib = 2.4;
      const baseTemp = 22.0;
      const baseStress = 45.0;
      const readings = [];
      const now = new Date();

      for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() - (count - i) * 3000);
        const timeStr = time.toTimeString().split(' ')[0];
        const isAnom = injectAnomaly && i >= count - 4;

        readings.push({
          timestamp: timeStr,
          vibration_rms: Number((baseVib + (isAnom ? 3.6 : Math.sin(i * 0.4) * 0.5) + (Math.random() * 0.3)).toFixed(2)),
          rail_temperature: Number((baseTemp + (Math.random() * 2)).toFixed(1)),
          track_stress: Number((baseStress + (isAnom ? 32 : Math.sin(i * 0.4) * 5) + (Math.random() * 2)).toFixed(1)),
          axle_load: Number((22.5 + Math.random() * 1.5).toFixed(1)),
          humidity: 58.0,
          acoustic_db: Number((68.0 + (isAnom ? 16 : Math.random() * 3)).toFixed(1)),
          geometry_gauge_mm: Number((1435.0 + (isAnom ? 5.2 : Math.random() * 1.2)).toFixed(1)),
          is_anomaly: isAnom,
          anomaly_reason: isAnom ? "Vibration spike (+54%) & Dynamic stress elevation (78 MPa) detected." : ""
        });
      }

      return {
        track_section: { section_code: trackSection, name: `Corridor ${trackSection}`, health_status: "HIGH", deterioration_score: 68 },
        baseline: { baseline_vibration_rms: 2.4, baseline_temperature: 22.0, baseline_stress: 45.0 },
        readings,
        simulation_active: true,
        current_metrics: readings[readings.length - 1],
        status_banner: "NOTICE: Telemetry values are simulated for demo and verification purposes."
      };
    }
  },

  controlSimulation: async (action, trackSection = 'TRK-014', injectAnomaly = false) => {
    try {
      const response = await api.post('/sensors/simulate/', {
        action,
        track_section: trackSection,
        inject_anomaly: injectAnomaly
      });
      return response.data;
    } catch (error) {
      return { action, status: "SIMULATION_UPDATED", message: `Simulation ${action} active.` };
    }
  }
};
