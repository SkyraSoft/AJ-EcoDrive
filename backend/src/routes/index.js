import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import customerRoutes from './customer.routes.js'
import quotationRoutes from './quotation.routes.js'
import orderRoutes from './order.routes.js'
import invoiceRoutes from './invoice.routes.js'
import paymentRoutes from './payment.routes.js'
import productRoutes from './product.routes.js'
import categoryRoutes from './category.routes.js'
import inventoryRoutes from './inventory.routes.js'
import procurementRoutes from './procurement.routes.js'
import financeRoutes from './finance.routes.js'
import afterSalesRoutes from './after_sales.routes.js'
import leadRoutes from './lead.routes.js'
import followUpRoutes from './follow_up.routes.js'
import organisationRoutes from './organisation.routes.js'
import communicationRoutes from './communication.routes.js'
import analyticsRoutes from './analytics.routes.js'
import { customOrdersRouter, deliveriesRouter, salesReturnsRouter } from './sales_extensions.routes.js'
import { authenticateJWT } from '../middleware/auth.js'

const apiRouter = Router()

// ============================================================================
// Public Endpoints
// ============================================================================

// Health check endpoint -> /api/v1/health
apiRouter.use('/health', healthRoutes)

// Authentication & Session endpoints -> /api/v1/auth (login is public, me/logout protected inside)
apiRouter.use('/auth', authRoutes)

// ============================================================================
// Protected Business API Routes (Enforced via authenticateJWT)
// ============================================================================

// Customer & CRM endpoints -> /api/v1/customers
apiRouter.use('/customers', authenticateJWT, customerRoutes)

// Quotation endpoints -> /api/v1/quotations
apiRouter.use('/quotations', authenticateJWT, quotationRoutes)

// Sales Order endpoints -> /api/v1/orders
apiRouter.use('/orders', authenticateJWT, orderRoutes)

// Sales Extensions: Custom Orders, Deliveries & Returns
apiRouter.use('/custom-orders', authenticateJWT, customOrdersRouter)
apiRouter.use('/orders/custom-orders', authenticateJWT, customOrdersRouter)
apiRouter.use('/deliveries', authenticateJWT, deliveriesRouter)
apiRouter.use('/orders/deliveries', authenticateJWT, deliveriesRouter)
apiRouter.use('/sales-returns', authenticateJWT, salesReturnsRouter)
apiRouter.use('/orders/sales-returns', authenticateJWT, salesReturnsRouter)

// Invoice endpoints -> /api/v1/invoices
apiRouter.use('/invoices', authenticateJWT, invoiceRoutes)

// Payment endpoints -> /api/v1/payments
apiRouter.use('/payments', authenticateJWT, paymentRoutes)

// Catalogue, Products & Categories endpoints -> /api/v1/catalogue, /api/v1/products, /api/v1/categories
apiRouter.use('/catalogue', authenticateJWT, productRoutes)
apiRouter.use('/products', authenticateJWT, productRoutes)
apiRouter.use('/categories', authenticateJWT, categoryRoutes)

// Inventory & Logistics endpoints -> /api/v1/inventory
apiRouter.use('/inventory', authenticateJWT, inventoryRoutes)

// Procurement, Vendors, Purchase Orders & GRN endpoints -> /api/v1/procurement
apiRouter.use('/procurement', authenticateJWT, procurementRoutes)

// Finance & Accounting endpoints -> /api/v1/finance
apiRouter.use('/finance', authenticateJWT, financeRoutes)

// After-Sales & Workshop endpoints -> /api/v1/after-sales
apiRouter.use('/after-sales', authenticateJWT, afterSalesRoutes)

// CRM: Leads & Inquiries endpoints -> /api/v1/leads
apiRouter.use('/leads', authenticateJWT, leadRoutes)

// CRM: Scheduled Follow-ups endpoints -> /api/v1/follow-ups
apiRouter.use('/follow-ups', authenticateJWT, followUpRoutes)

// Organisation, Branches, Users & Roles -> /api/v1/organisation
apiRouter.use('/organisation', authenticateJWT, organisationRoutes)

// Internal Communication & Messaging -> /api/v1/communication
apiRouter.use('/communication', authenticateJWT, communicationRoutes)

// Analytics & Reports Hub -> /api/v1/analytics
apiRouter.use('/analytics', authenticateJWT, analyticsRoutes)

// API root metadata
apiRouter.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'AJ EcoDrive ERP API Gateway',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      customers: '/api/v1/customers',
      leads: '/api/v1/leads',
      followUps: '/api/v1/follow-ups',
      quotations: '/api/v1/quotations',
      orders: '/api/v1/orders',
      customOrders: '/api/v1/custom-orders',
      deliveries: '/api/v1/deliveries',
      salesReturns: '/api/v1/sales-returns',
      invoices: '/api/v1/invoices',
      payments: '/api/v1/payments',
      catalogue: '/api/v1/catalogue',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      inventory: '/api/v1/inventory',
      procurement: '/api/v1/procurement',
      finance: '/api/v1/finance',
      afterSales: '/api/v1/after-sales',
      organisation: '/api/v1/organisation',
      communication: '/api/v1/communication',
      analytics: '/api/v1/analytics'
    }
  })
})

export default apiRouter
