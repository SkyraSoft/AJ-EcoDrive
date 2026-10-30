import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authenticateJWT } from '../middleware/auth.js'

const router = Router()

// Public authentication endpoint
router.post('/login', AuthController.login)

// Password reset endpoints
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/verify-identity', AuthController.verifyIdentity)
router.post('/verify-otp', AuthController.verifyIdentity)
router.post('/reset-password', AuthController.resetPassword)

// Protected user profile endpoints
router.get('/me', authenticateJWT, AuthController.getMe)
router.put('/profile', authenticateJWT, AuthController.updateProfile)

// Logout endpoint
router.post('/logout', AuthController.logout)

export default router

