/**
 * AJ EcoDrive — Master HTTP REST API Client Service Layer
 * 
 * Provides centralized, authenticated, resilient HTTP communication between
 * the Vue frontend and the AJ EcoDrive Backend Services & API Gateway.
 * 
 * Features:
 * - Dynamic Base URL from environment (VITE_API_BASE_URL || VITE_API_URL)
 * - Automatic Authorization Header injection (Bearer token from active session)
 * - Multi-Tenant Branch Scoping Header (X-Branch-ID)
 * - Request Timeout via AbortController
 * - Error Normalization with custom ApiError
 * - Graceful Offline / Fallback Detection when backend server is offline
 * - 12 Domain Endpoints matching the Master Architecture Specification
 */

import { resolveCanonicalBranchId } from '../utils/branchAuth.js'

export class ApiError extends Error {
  constructor(message, status = 500, data = null, isOffline = false) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.isOffline = isOffline
    this.validationErrors = data?.errors || data?.details || null
    this.isServerError = status >= 500
    this.timestamp = new Date().toISOString()
  }
}

class ApiClient {
  constructor() {
    this.baseUrl = this.resolveBaseUrl()
    this.timeoutMs = Number(import.meta.env?.VITE_API_TIMEOUT_MS) || 12000
    this.isOfflineMode = false
    this.manualToken = null
    this.listeners = new Set()
  }

  get isOffline() {
    return this.isOfflineMode
  }

  setOfflineMode(mode) {
    this.isOfflineMode = Boolean(mode)
  }

  setToken(token) {
    this.manualToken = token || null
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem('ecodrive_token', token)
      else localStorage.removeItem('ecodrive_token')
    }
  }

  clearToken() {
    this.manualToken = null
    if (typeof localStorage !== 'undefined') localStorage.removeItem('ecodrive_token')
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('ecodrive_token')
  }

  resolveBaseUrl() {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')
      if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
    }
    return 'http://localhost:3000/api/v1'
  }

  setBaseUrl(url) {
    this.baseUrl = (url || '').replace(/\/+$/, '')
  }

  /**
   * Retrieves active session token and canonical branch identity
   */
  getAuthContext() {
    try {
      const directToken = this.manualToken ||
        (typeof localStorage !== 'undefined' && (localStorage.getItem('ecodrive_token') || localStorage.getItem('auth_token'))) ||
        (typeof sessionStorage !== 'undefined' && (sessionStorage.getItem('ecodrive_token') || sessionStorage.getItem('auth_token')))

      const sessionRaw = (typeof localStorage !== 'undefined' && localStorage.getItem('ecodrive_auth_session')) ||
                         (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ecodrive_auth_session'))
      
      let session = null
      if (sessionRaw) {
        session = JSON.parse(sessionRaw)
      } else if (typeof globalThis !== 'undefined' && globalThis.store?.currentUser?.isAuthenticated) {
        session = globalThis.store.currentUser
      }

      if (session || directToken) {
        const token = directToken || session?.token || session?.jwt || (session?.id ? `mock-token-${session.id}` : null)
        const rawBranchId = session?.branch_id || session?.branchId || session?.branchCode || session?.branch || null
        const branchId = resolveCanonicalBranchId(rawBranchId) || rawBranchId
        const role = session?.role || null
        return { token, branchId, role }
      }
    } catch {
      // Ignore parse errors
    }
    return { token: this.manualToken || null, branchId: null, role: null }
  }

  /**
   * Builds request headers with Content-Type, Authorization, and Canonical Branch Context
   */
  buildHeaders(customHeaders = {}) {
    const { token, branchId, role } = this.getAuthContext()
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    }

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (branchId && !headers['X-Branch-ID']) {
      headers['X-Branch-ID'] = String(branchId)
    }

    if (role && !headers['X-User-Role']) {
      headers['X-User-Role'] = String(role)
    }

    return headers
  }

  /**
   * Core request dispatcher with timeout, response parsing, and error interception
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, headers = {}, params = null, timeout = this.timeoutMs } = options

    let url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`

    if (params && typeof params === 'object') {
      const queryParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      }
      const queryString = queryParams.toString()
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString
      }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    const reqConfig = {
      method,
      headers: this.buildHeaders(headers),
      signal: controller.signal
    }

    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      reqConfig.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    try {
      const response = await fetch(url, reqConfig)
      clearTimeout(timer)

      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ecodrive:unauthorized', { detail: { endpoint, status: 401 } }))
        }
      }

      // Handle 403 Forbidden globally
      if (response.status === 403) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ecodrive:forbidden', { detail: { endpoint, status: 403 } }))
        }
      }

      let data = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch {
          data = null
        }
      } else {
        try {
          data = await response.text()
        } catch {
          data = null
        }
      }

      if (!response.ok) {
        const errorMsg = (data && (data.message || data.error)) || `HTTP ${response.status} ${response.statusText}`
        throw new ApiError(errorMsg, response.status, data, false)
      }

      this.isOfflineMode = false
      return { ok: true, status: response.status, data }
    } catch (err) {
      clearTimeout(timer)

      if (err instanceof ApiError) {
        throw err
      }

      const isNetworkOrAbort = err.name === 'AbortError' ||
                               err.name === 'TypeError' ||
                               (err.message && err.message.toLowerCase().includes('failed to fetch'))

      this.isOfflineMode = true

      // Construct resilient offline error envelope
      const offlineError = new ApiError(
        isNetworkOrAbort
          ? `Backend API server unreachable at ${this.baseUrl} (${err.message})`
          : (err.message || 'Unknown Network Error'),
        0,
        { originalError: err.message, endpoint },
        true
      )

      throw offlineError
    }
  }

  // HTTP Verb Shortcuts
  get(endpoint, params = null, options = {}) {
    return this.request(endpoint, { method: 'GET', params, ...options })
  }

  post(endpoint, body = null, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options })
  }

  put(endpoint, body = null, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options })
  }

  patch(endpoint, body = null, options = {}) {
    return this.request(endpoint, { method: 'PATCH', body, ...options })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }

  // ==========================================
  // Domain 1: Authentication & Sessions
  // ==========================================
  auth = {
    login: (credentials) => this.post('/auth/login', credentials),
    logout: () => this.post('/auth/logout'),
    verifyIdentity: (payload) => this.post('/auth/verify-identity', payload),
    forgotPassword: (payload) => this.post('/auth/forgot-password', payload),
    resetPassword: (payload) => this.post('/auth/reset-password', payload),
    getMe: () => this.get('/auth/me'),
    updateProfile: (payload) => this.put('/auth/profile', payload)
  }

  // ==========================================
  // Domain 2: Customers & CRM
  // ==========================================
  customers = {
    getAll: (params) => this.get('/customers', params),
    getById: (id) => this.get(`/customers/${id}`),
    create: (payload) => this.post('/customers', payload),
    update: (id, payload) => this.put(`/customers/${id}`, payload),
    delete: (id) => this.delete(`/customers/${id}`)
  }

  leads = {
    getAll: (params) => this.get('/leads', params),
    getById: (id) => this.get(`/leads/${id}`),
    create: (payload) => this.post('/leads', payload),
    update: (id, payload) => this.put(`/leads/${id}`, payload),
    delete: (id) => this.delete(`/leads/${id}`),
    convertToCustomer: (id, payload = {}) => this.post(`/leads/${id}/convert`, payload)
  }

  followUps = {
    getAll: (params) => this.get('/follow-ups', params),
    getById: (id) => this.get(`/follow-ups/${id}`),
    create: (payload) => this.post('/follow-ups', payload),
    update: (id, payload) => this.put(`/follow-ups/${id}`, payload),
    complete: (id, payload = {}) => this.post(`/follow-ups/${id}/complete`, payload),
    delete: (id) => this.delete(`/follow-ups/${id}`)
  }

  // ==========================================
  // Domain 3: Sales, Quotations & Orders
  // ==========================================
  quotations = {
    getAll: (params) => this.get('/quotations', params),
    getById: (id) => this.get(`/quotations/${id}`),
    create: (payload) => this.post('/quotations', payload),
    update: (id, payload) => this.put(`/quotations/${id}`, payload),
    convertToOrder: (id, payload = {}) => this.post(`/quotations/${id}/convert-to-order`, payload)
  }

  orders = {
    getAll: (params) => this.get('/orders', params),
    getById: (id) => this.get(`/orders/${id}`),
    create: (payload) => this.post('/orders', payload),
    checkout: (payload) => this.post('/orders/checkout', payload),
    update: (id, payload) => this.put(`/orders/${id}`, payload),
    cancel: (id, payload = {}) => this.post(`/orders/${id}/cancel`, payload),
    customOrders: {
      getAll: (params) => this.get('/custom-orders', params),
      getById: (id) => this.get(`/custom-orders/${id}`),
      create: (payload) => this.post('/custom-orders', payload),
      update: (id, payload) => this.put(`/custom-orders/${id}`, payload),
      delete: (id) => this.delete(`/custom-orders/${id}`)
    }
  }

  customOrders = {
    getAll: (params) => this.get('/custom-orders', params),
    getById: (id) => this.get(`/custom-orders/${id}`),
    create: (payload) => this.post('/custom-orders', payload),
    update: (id, payload) => this.put(`/custom-orders/${id}`, payload),
    delete: (id) => this.delete(`/custom-orders/${id}`)
  }

  invoices = {
    getAll: (params) => this.get('/invoices', params),
    getById: (id) => this.get(`/invoices/${id}`),
    create: (payload) => this.post('/invoices', payload),
    recordPayment: (invoiceId, payload) => this.post(`/invoices/${invoiceId}/payments`, payload)
  }

  payments = {
    getAll: (params) => this.get('/payments', params),
    getById: (id) => this.get(`/payments/${id}`),
    create: (payload) => this.post('/payments', payload)
  }

  deliveries = {
    getAll: (params) => this.get('/deliveries', params),
    getById: (id) => this.get(`/deliveries/${id}`),
    create: (payload) => this.post('/deliveries', payload),
    update: (id, payload) => this.put(`/deliveries/${id}`, payload),
    complete: (id, payload = {}) => this.post(`/deliveries/${id}/complete`, payload),
    delete: (id) => this.delete(`/deliveries/${id}`)
  }

  salesReturns = {
    getAll: (params) => this.get('/sales-returns', params),
    getById: (id) => this.get(`/sales-returns/${id}`),
    create: (payload) => this.post('/sales-returns', payload),
    update: (id, payload) => this.put(`/sales-returns/${id}`, payload),
    delete: (id) => this.delete(`/sales-returns/${id}`)
  }

  // ==========================================
  // Domain 4: Inventory & Logistics
  // ==========================================
  inventory = {
    getUnits: (params) => this.get('/inventory/units', params),
    getUnitById: (id) => this.get(`/inventory/units/${id}`),
    transitionStatus: (id, status, meta = {}) => this.post(`/inventory/units/${id}/transition`, { status, ...meta }),
    reserveUnit: (id, orderId) => this.post(`/inventory/units/${id}/reserve`, { orderId }),
    releaseReservation: (id) => this.post(`/inventory/units/${id}/release-reservation`),
    getLedger: (params) => this.get('/inventory/ledger', params),
    getStock: (params) => this.get('/inventory/stock', params),
    recordReceipt: (payload) => this.post('/inventory/receipts', payload),
    recordIssue: (payload) => this.post('/inventory/issues', payload),

    transfers: {
      getAll: (params) => this.get('/inventory/transfers', params),
      getById: (id) => this.get(`/inventory/transfers/${id}`),
      create: (payload) => this.post('/inventory/transfers', payload),
      approve: (id, payload = {}) => this.post(`/inventory/transfers/${id}/approve`, payload),
      dispatch: (id, payload = {}) => this.post(`/inventory/transfers/${id}/dispatch`, payload),
      receive: (id, payload = {}) => this.post(`/inventory/transfers/${id}/receive`, payload)
    },

    stockRequests: {
      getAll: (params) => this.get('/inventory/stock-requests', params),
      getById: (id) => this.get(`/inventory/stock-requests/${id}`),
      create: (payload) => this.post('/inventory/stock-requests', payload),
      update: (id, payload) => this.put(`/inventory/stock-requests/${id}`, payload),
      delete: (id) => this.delete(`/inventory/stock-requests/${id}`),
      approve: (id, payload = {}) => this.post(`/inventory/stock-requests/${id}/approve`, payload),
      reject: (id, payload = {}) => this.post(`/inventory/stock-requests/${id}/reject`, payload)
    },

    adjustments: {
      getAll: (params) => this.get('/inventory/adjustments', params),
      create: (payload) => this.post('/inventory/adjustments', payload),
      approve: (id, payload = {}) => this.post(`/inventory/adjustments/${id}/approve`, payload),
      reject: (id, payload = {}) => this.post(`/inventory/adjustments/${id}/reject`, payload)
    },

    cycleCounts: {
      getAll: (params) => this.get('/inventory/cycle-counts', params),
      getById: (id) => this.get(`/inventory/cycle-counts/${id}`),
      create: (payload) => this.post('/inventory/cycle-counts', payload),
      update: (id, payload) => this.put(`/inventory/cycle-counts/${id}`, payload),
      delete: (id) => this.delete(`/inventory/cycle-counts/${id}`)
    },

    quarantine: {
      getAll: (params) => this.get('/inventory/quarantine', params),
      getById: (id) => this.get(`/inventory/quarantine/${id}`),
      create: (payload) => this.post('/inventory/quarantine', payload),
      update: (id, payload) => this.put(`/inventory/quarantine/${id}`, payload),
      delete: (id) => this.delete(`/inventory/quarantine/${id}`)
    }
  }

  // ==========================================
  // Domain 5: Catalogue & Products
  // ==========================================
  catalogue = {
    getProducts: (params) => this.get('/catalogue/products', params),
    getProductById: (id) => this.get(`/catalogue/products/${id}`),
    createProduct: (payload) => this.post('/catalogue/products', payload),
    updateProduct: (id, payload) => this.put(`/catalogue/products/${id}`, payload),

    getCategories: (params) => this.get('/catalogue/categories', params),
    createCategory: (payload) => this.post('/catalogue/categories', payload),

    getPricingRules: (params) => this.get('/catalogue/pricing-rules', params),
    getPriceRuleById: (id) => this.get(`/catalogue/pricing-rules/${id}`),
    createPriceRule: (payload) => this.post('/catalogue/pricing-rules', payload),
    updatePriceRule: (id, payload) => this.put(`/catalogue/pricing-rules/${id}`, payload),
    deletePriceRule: (id) => this.delete(`/catalogue/pricing-rules/${id}`),

    getProductRequests: (params) => this.get('/catalogue/product-requests', params),
    getProductRequestById: (id) => this.get(`/catalogue/product-requests/${id}`),
    createProductRequest: (payload) => this.post('/catalogue/product-requests', payload),
    updateProductRequest: (id, payload) => this.put(`/catalogue/product-requests/${id}`, payload),
    deleteProductRequest: (id) => this.delete(`/catalogue/product-requests/${id}`)
  }

  // ==========================================
  // Domain 6: Procurement & Vendors
  // ==========================================
  procurement = {
    getPurchaseOrders: (params) => this.get('/procurement/purchase-orders', params),
    getPurchaseOrderById: (id) => this.get(`/procurement/purchase-orders/${id}`),
    createPurchaseOrder: (payload) => this.post('/procurement/purchase-orders', payload),
    updatePurchaseOrder: (id, payload) => this.put(`/procurement/purchase-orders/${id}`, payload),
    approvePurchaseOrder: (id, payload = {}) => this.post(`/procurement/purchase-orders/${id}/approve`, payload),
    sendPurchaseOrder: (id, payload = {}) => this.post(`/procurement/purchase-orders/${id}/send`, payload),
    cancelPurchaseOrder: (id, payload = {}) => this.post(`/procurement/purchase-orders/${id}/cancel`, payload),
    receivePurchaseOrder: (id, payload) => this.post(`/procurement/purchase-orders/${id}/receive`, payload),

    getSuppliers: (params) => this.get('/procurement/suppliers', params),
    getSupplierById: (id) => this.get(`/procurement/suppliers/${id}`),
    createSupplier: (payload) => this.post('/procurement/suppliers', payload),
    updateSupplier: (id, payload) => this.put(`/procurement/suppliers/${id}`, payload),
    deleteSupplier: (id) => this.delete(`/procurement/suppliers/${id}`),

    getReceipts: (params) => this.get('/procurement/receipts', params),
    getReceiptById: (id) => this.get(`/procurement/receipts/${id}`),
    createReceipt: (payload) => this.post('/procurement/receipts', payload),

    getVendorBills: (params) => this.get('/procurement/vendor-bills', params),
    getVendorBillById: (id) => this.get(`/procurement/vendor-bills/${id}`),
    payVendorBill: (id, payload = {}) => this.post(`/procurement/vendor-bills/${id}/pay`, payload),

    getPurchaseReturns: (params) => this.get('/procurement/purchase-returns', params),
    getPurchaseReturnById: (id) => this.get(`/procurement/purchase-returns/${id}`),
    createPurchaseReturn: (payload) => this.post('/procurement/purchase-returns', payload),
    approvePurchaseReturn: (id) => this.post(`/procurement/purchase-returns/${id}/approve`),
    getVendorDebitNotes: (params) => this.get('/procurement/vendor-debit-notes', params)
  }

  // ==========================================
  // Domain 7: After-Sales & Workshop
  // ==========================================
  afterSales = {
    getCases: (params) => this.get('/after-sales/cases', params),
    getCaseById: (id) => this.get(`/after-sales/cases/${id}`),
    createCase: (payload) => this.post('/after-sales/cases', payload),
    updateCase: (id, payload) => this.put(`/after-sales/cases/${id}`, payload),

    getRepairJobs: (params) => this.get('/after-sales/repair-jobs', params),
    getRepairJobById: (id) => this.get(`/after-sales/repair-jobs/${id}`),
    createRepairJob: (payload) => this.post('/after-sales/repair-jobs', payload),
    updateRepairJob: (id, payload) => this.put(`/after-sales/repair-jobs/${id}`, payload),
    completeRepairJob: (id, payload = {}) => this.post(`/after-sales/repair-jobs/${id}/complete`, payload),
    postRepairToFinance: (id, payload = {}) => this.post(`/after-sales/repair-jobs/${id}/post-finance`, payload),

    getWarrantyClaims: (params) => this.get('/after-sales/warranty-claims', params),
    getWarrantyClaimById: (id) => this.get(`/after-sales/warranty-claims/${id}`),
    createWarrantyClaim: (payload) => this.post('/after-sales/warranty-claims', payload),
    approveWarrantyClaim: (id, payload = {}) => this.post(`/after-sales/warranty-claims/${id}/approve`, payload),
    rejectWarrantyClaim: (id, payload = {}) => this.post(`/after-sales/warranty-claims/${id}/reject`, payload),
    getOverview: () => this.get('/after-sales/overview')
  }

  // ==========================================
  // Domain 8: Finance & Expenses
  // ==========================================
  finance = {
    getExpenses: (params) => this.get('/finance/expenses', params),
    getExpenseById: (id) => this.get(`/finance/expenses/${id}`),
    createExpense: (payload) => this.post('/finance/expenses', payload),
    updateExpense: (id, payload) => this.put(`/finance/expenses/${id}`, payload),
    approveExpense: (id, payload = {}) => this.post(`/finance/expenses/${id}/approve`, payload),
    rejectExpense: (id, payload = {}) => this.post(`/finance/expenses/${id}/reject`, payload),
    payExpense: (id, payload = {}) => this.post(`/finance/expenses/${id}/pay`, payload),
    deleteExpense: (id) => this.delete(`/finance/expenses/${id}`),
    getCashBank: (params) => this.get('/finance/cash-bank', params),
    getTransactions: (params) => this.get('/finance/transactions', params),
    reverseTransaction: (id, payload = {}) => this.post(`/finance/transactions/${id}/reverse`, payload),
    getGeneralLedger: (params) => this.get('/finance/general-ledger', params),
    getTrialBalance: (params) => this.get('/finance/trial-balance', params),
    getOverview: (params) => this.get('/finance/overview', params),
    getCategories: () => this.get('/finance/categories')
  }

  communication = {
    getConversations: (params) => this.get('/communication/conversations', params),
    getConversationById: (id) => this.get(`/communication/conversations/${id}`),
    createConversation: (payload) => this.post('/communication/conversations', payload),
    updateConversation: (id, payload) => this.put(`/communication/conversations/${id}`, payload),
    deleteConversation: (id) => this.delete(`/communication/conversations/${id}`),
    addMessage: (id, payload) => this.post(`/communication/conversations/${id}/messages`, payload),
    getNotifications: (params) => this.get('/communication/notifications', params)
  }

  // ==========================================
  // Domain 10: Analytics & Reports Hub
  // ==========================================
  analytics = {
    getCustomReports: (params) => this.get('/analytics/custom-reports', params),
    getCustomReportById: (id) => this.get(`/analytics/custom-reports/${id}`),
    createCustomReport: (payload) => this.post('/analytics/custom-reports', payload),
    updateCustomReport: (id, payload) => this.put(`/analytics/custom-reports/${id}`, payload),
    deleteCustomReport: (id) => this.delete(`/analytics/custom-reports/${id}`)
  }

  // ==========================================
  // Domain 11: System, Organisation & Audit
  // ==========================================
  system = {
    getSettings: () => this.get('/system/settings'),
    updateSettings: (payload) => this.put('/system/settings', payload),
    getAuditLogs: (params) => this.get('/system/audit-logs', params),

    getBranches: (params) => this.get('/organisation/branches', params),
    getBranchById: (id) => this.get(`/organisation/branches/${id}`),
    createBranch: (payload) => this.post('/organisation/branches', payload),
    updateBranch: (id, payload) => this.put(`/organisation/branches/${id}`, payload),

    getUsers: (params) => this.get('/organisation/users', params),
    getUserById: (id) => this.get(`/organisation/users/${id}`),
    createUser: (payload) => this.post('/organisation/users', payload),
    updateUser: (id, payload) => this.put(`/organisation/users/${id}`, payload),

    getRoles: () => this.get('/organisation/roles'),
    createRole: (payload) => this.post('/organisation/roles', payload)
  }
}

// Singleton API Client instance
export const api = new ApiClient()
export default api
