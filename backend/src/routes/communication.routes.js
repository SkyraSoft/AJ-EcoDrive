import { Router } from 'express'
import { CommunicationController } from '../controllers/communication.controller.js'

const router = Router()

// Conversations
router.get('/conversations', CommunicationController.listConversations)
router.get('/conversations/:id', CommunicationController.getConversationById)
router.post('/conversations', CommunicationController.createConversation)
router.put('/conversations/:id', CommunicationController.updateConversation)
router.delete('/conversations/:id', CommunicationController.deleteConversation)

// Messages within conversation
router.post('/conversations/:id/messages', CommunicationController.addMessage)
router.post('/conversations/:id/attachments', CommunicationController.addMessage)

// Notifications
router.get('/notifications', CommunicationController.getNotifications)

// Root communication list
router.get('/', CommunicationController.listConversations)
router.post('/', CommunicationController.createConversation)

export default router
