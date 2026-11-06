import { SettingsModel } from '../models/settings.model.js'
import { AuditModel } from '../models/audit.model.js'
import { isUserSuperAdmin } from '../utils/branchScope.js'

const ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

export const SettingsController = {
  /**
   * GET /api/v1/system/settings
   * GET /api/v1/system/settings/:section
   */
  async getSettings(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user) && !ADMIN_ROLES.includes(req.user?.role)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Viewing company settings requires Super Admin authorization.'
        })
      }
      const { section } = req.params
      if (section) {
        const data = await SettingsModel.getSection(section)
        return res.status(200).json({ ok: true, section, data })
      }
      const allSettings = await SettingsModel.getAll()
      return res.status(200).json({ ok: true, settings: allSettings })
    } catch (err) {
      next(err)
    }
  },

  /**
   * PUT /api/v1/system/settings/:section
   */
  async updateSettings(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user) && !ADMIN_ROLES.includes(req.user?.role)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Updating company settings requires Super Admin authorization.'
        })
      }
      const { section } = req.params
      const updateData = req.body

      if (!section) {
        return res.status(400).json({ ok: false, message: 'Settings section is required.' })
      }

      const beforeState = await SettingsModel.getSection(section)
      const updated = await SettingsModel.saveSection(section, updateData, req.user?.name || 'Super Admin')

      // Auditing every settings configuration change
      await AuditModel.createLog({
        user: req.user?.name || 'Super Admin',
        role: req.user?.role || 'Super Admin',
        action: 'Update System Settings',
        category: 'System Configuration',
        entity_id: `SETTINGS-${section.toUpperCase()}`,
        details: `Updated system configuration section '${section}'.`,
        severity: 'Info',
        branch_id: 'BR-HQ',
        branch: 'Head Office',
        acting_user_branch_id: req.user?.branch_id || 'BR-HQ',
        affected_branch_id: 'BR-HQ',
        before_state: beforeState,
        after_state: updated
      })

      return res.status(200).json({
        ok: true,
        message: `Settings for section '${section}' updated successfully.`,
        section,
        data: updated
      })
    } catch (err) {
      next(err)
    }
  }
}
