import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1')

if (import.meta.env.DEV) {
  console.debug('API_BASE_URL:', API_BASE_URL)
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export const complianceAPI = {
  // ── Onboarding ────────────────────────────────────────────
  saveOnboarding: async (data) => {
    const response = await api.post('/compliance/onboarding', data)
    return response.data
  },
  getOnboarding: async (sessionId) => {
    const response = await api.get(`/compliance/onboarding/${sessionId}`)
    return response.data
  },

  // ── Gap Analysis ──────────────────────────────────────────
  performGapAnalysis: async (data) => {
    const response = await api.post('/compliance/gap-analysis', data, { timeout: 120000 })
    return response.data
  },

  // ── Policy Generation ─────────────────────────────────────
  generatePolicy: async (data) => {
    const response = await api.post('/compliance/generate-policy', data, { timeout: 120000 })
    return response.data
  },

  // ── Assessment ────────────────────────────────────────────
  performAssessment: async (data) => {
    const response = await api.post('/compliance/assessment', data, { timeout: 90000 })
    return response.data
  },

  // ── Action Plan ───────────────────────────────────────────
  generateActionPlan: async (data) => {
    const response = await api.post('/compliance/action-plan', data, { timeout: 90000 })
    return response.data
  },

  // ── Verification ──────────────────────────────────────────
  verifyDocument: async (data) => {
    const response = await api.post('/compliance/verify', data, { timeout: 90000 })
    return response.data
  },

  // ── Chat ──────────────────────────────────────────────────
  chat: async (data) => {
    const response = await api.post('/compliance/chat', data, { timeout: 60000 })
    return response.data
  },

  // ── Email Subscribe ────────────────────────────────────────
  subscribe: async (data) => {
    const response = await api.post('/compliance/subscribe', data)
    return response.data
  },

  // ── Frameworks ────────────────────────────────────────────
  listFrameworks: async () => {
    const response = await api.get('/compliance/frameworks')
    return response.data
  },
  getFrameworkControls: async (frameworkId) => {
    const response = await api.get(`/compliance/frameworks/${frameworkId}/controls`)
    return response.data
  },

  // ── Health Check ──────────────────────────────────────────
  healthCheck: async () => {
    const response = await api.get('/health')
    return response.data
  },

  // ── Register CRUD ─────────────────────────────────────────
  listRisks: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/risks`)
    return response.data
  },
  createRisk: async (sessionId, data) => {
    const response = await api.post(`/compliance/registers/${sessionId}/risks`, data)
    return response.data
  },
  updateRisk: async (entryId, data) => {
    const response = await api.put(`/compliance/registers/risks/${entryId}`, data)
    return response.data
  },
  deleteRisk: async (entryId) => {
    await api.delete(`/compliance/registers/risks/${entryId}`)
  },
  listAssets: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/assets`)
    return response.data
  },
  createAsset: async (sessionId, data) => {
    const response = await api.post(`/compliance/registers/${sessionId}/assets`, data)
    return response.data
  },
  listSuppliers: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/suppliers`)
    return response.data
  },
  listDataProcessing: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/data-processing`)
    return response.data
  },
  listAISystems: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/ai-systems`)
    return response.data
  },
  listControls: async (sessionId, framework) => {
    const params = framework ? { framework } : {}
    const response = await api.get(`/compliance/registers/${sessionId}/controls`, { params })
    return response.data
  },
  listEvidence: async (sessionId, controlId) => {
    const params = controlId ? { control_id: controlId } : {}
    const response = await api.get(`/compliance/registers/${sessionId}/evidence`, { params })
    return response.data
  },
  getRegisterSummary: async (sessionId) => {
    const response = await api.get(`/compliance/registers/${sessionId}/summary`)
    return response.data
  },
  exportAuditPack: async (data) => {
    const response = await api.post('/compliance/export-audit-pack', data, {
      responseType: 'blob',
      timeout: 60000,
    })
    return response.data
  },
}

export default api
