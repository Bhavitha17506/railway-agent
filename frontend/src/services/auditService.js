import api from './api';
import { mockAuditLogs } from './mockData';

export const auditService = {
  getLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit/logs/', { params });
      return response.data.results || response.data;
    } catch (error) {
      return mockAuditLogs;
    }
  }
};
