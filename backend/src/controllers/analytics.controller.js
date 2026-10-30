import { CustomReportModel } from '../models/analytics.model.js'

export const AnalyticsController = {
  async listCustomReports(req, res, next) {
    try {
      const { category, search, limit, offset } = req.query
      const data = await CustomReportModel.findAll({
        category,
        search,
        limit,
        offset
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getCustomReportById(req, res, next) {
    try {
      const { id } = req.params
      const record = await CustomReportModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createCustomReport(req, res, next) {
    try {
      const name = req.body.name || req.body.report
      if (!name || !String(name).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Report title / name is required' })
      }

      const created = await CustomReportModel.create(req.body)
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateCustomReport(req, res, next) {
    try {
      const { id } = req.params
      const updated = await CustomReportModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteCustomReport(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await CustomReportModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Custom report ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
}
