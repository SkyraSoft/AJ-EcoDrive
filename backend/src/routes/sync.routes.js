/**
 * AJ ECODRIVE ERP — SYNCHRONIZATION API ROUTES
 * 
 * Secure routes mounted at /api/v1/sync
 */

import { Router } from 'express'
import { SyncController } from '../controllers/sync.controller.js'

const router = Router()

// POST /api/v1/sync/push — Push client outbox mutations with idempotency
router.post('/push', SyncController.pushMutations)

// GET /api/v1/sync/pull — Incremental delta sync for changed records and tombstones
router.get('/pull', SyncController.pullChanges)

// GET /api/v1/sync/status — Health and metadata for sync protocol
router.get('/status', SyncController.getSyncStatus)

export default router
