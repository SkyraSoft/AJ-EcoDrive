import { ConversationModel } from '../models/communication.model.js'
import { getEffectiveBranch } from '../utils/branchScope.js'

export const CommunicationController = {
  async listConversations(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await ConversationModel.findAll({
        branch_id: branchId,
        status,
        search,
        limit,
        offset
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getConversationById(req, res, next) {
    try {
      const { id } = req.params
      const record = await ConversationModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Conversation ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createConversation(req, res, next) {
    try {
      const title = req.body.title || req.body.subject
      if (!title || !String(title).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Conversation title / subject is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await ConversationModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateConversation(req, res, next) {
    try {
      const { id } = req.params
      const updated = await ConversationModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Conversation ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async addMessage(req, res, next) {
    try {
      const { id } = req.params
      const text = req.body.text || req.body.message
      if (!text || !String(text).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Message text is required' })
      }

      const branch = req.body.branch || req.user?.branchName || 'Peshawar'
      const sender = req.body.sender || req.user?.name || 'Staff'

      const updated = await ConversationModel.addMessage(id, {
        sender,
        branch,
        text,
        role: req.body.role || branch,
        attachment: req.body.attachment || null,
        time: req.body.time || 'Just now'
      })

      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Conversation ${id} not found` })
      }
      res.status(201).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteConversation(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await ConversationModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Conversation ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Conversation ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  async getNotifications(req, res, next) {
    try {
      // Mock notifications or derived from recent conversations/tasks
      const branchId = getEffectiveBranch(req)
      const convs = await ConversationModel.findAll({ branch_id: branchId, limit: 5 })
      const notifications = convs.map(c => ({
        id: `notif-${c.id}`,
        title: c.title,
        message: c.lastMsg,
        time: c.lastReply,
        type: 'communication',
        unread: c.unread > 0
      }))
      res.status(200).json({ ok: true, data: notifications })
    } catch (err) {
      next(err)
    }
  }
}
