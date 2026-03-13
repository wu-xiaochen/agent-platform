/**
 * API Client - 前端API服务
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== Agent API =====
export const agentApi = {
  list: () => api.get('/agents'),
  get: (id) => api.get(`/agents/${id}`),
  create: (data) => api.post('/agents', data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`),
  assignRole: (id, role) => api.post(`/agents/${id}/role`, { role }),
  getRole: (id) => api.get(`/agents/${id}/role`),
  createSnapshot: (id, state) => api.post(`/agents/${id}/snapshots`, { state }),
  restoreSnapshot: (id, snapshotId) => api.post(`/agents/${id}/snapshots/${snapshotId}/restore`),
  search: (criteria) => api.get('/agents/search/find', { params: criteria }),
};

// ===== Workflow API =====
export const workflowApi = {
  list: () => api.get('/workflows'),
  get: (id) => api.get(`/workflows/${id}`),
  create: (data) => api.post('/workflows', data),
  update: (id, data) => api.put(`/workflows/${id}`, data),
  delete: (id) => api.delete(`/workflows/${id}`),
  execute: (id) => api.post(`/workflows/${id}/execute`),
  pause: (id) => api.post(`/workflows/${id}/pause`),
  resume: (id) => api.post(`/workflows/${id}/resume`),
  stop: (id) => api.post(`/workflows/${id}/stop`),
};

// ===== Knowledge API =====
export const knowledgeApi = {
  getStats: () => api.get('/knowledge/stats'),
  listEntities: (params) => api.get('/knowledge/entities', { params }),
  getEntity: (id) => api.get(`/knowledge/entities/${id}`),
  createEntity: (data) => api.post('/knowledge/entities', data),
  updateEntity: (id, data) => api.put(`/knowledge/entities/${id}`, data),
  deleteEntity: (id) => api.delete(`/knowledge/entities/${id}`),
  query: (pattern) => api.post('/knowledge/query', { pattern }),
  listRelations: () => api.get('/knowledge/relations'),
  createRelation: (data) => api.post('/knowledge/relations', data),
  getMemories: (agentId, params) => api.get(`/knowledge/memory/${agentId}`, { params }),
  saveMemory: (agentId, data) => api.post(`/knowledge/memory/${agentId}`, data),
  inheritMemory: (toAgentId, fromAgentId, data) => 
    api.post(`/knowledge/memory/${toAgentId}/inherit/${fromAgentId}`, data),
  generateContext: (agentId, data) => api.post(`/knowledge/memory/${agentId}/context`, data),
  searchMemories: (params) => api.get('/knowledge/memory/search', { params }),
};

// ===== Metrics API =====
export const metricsApi = {
  getDashboard: (agentId) => api.get('/metrics', { params: { agentId } }),
  getScore: (agentId) => api.get(`/metrics/${agentId}/score`),
  record: (data) => api.post('/metrics', data),
  recordBatch: (metrics) => api.post('/metrics/batch', { metrics }),
  getAlerts: (params) => api.get('/metrics/alerts', { params }),
  acknowledgeAlert: (alertId) => api.post(`/metrics/alerts/${alertId}/acknowledge`),
  getAggregate: (agentId, params) => api.get(`/metrics/${agentId}/aggregate`, { params }),
};

// ===== Sandbox API =====
export const sandboxApi = {
  getAuditLogs: (params) => api.get('/sandbox/audit', { params }),
  execute: (data) => api.post('/sandbox/execute', data),
  checkPermission: (data) => api.post('/sandbox/check-permission', data),
  getRateLimit: (agentId) => api.get(`/sandbox/rate-limit/${agentId}`),
  setRateLimit: (data) => api.post('/sandbox/rate-limit', data),
  getAgentAuditLogs: (agentId) => api.get(`/sandbox/audit/${agentId}`),
};

// ===== Health Check =====
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
