import { query } from '../config/db.js'
import { resolveBranchId, getBranchName } from '../utils/branchScope.js'
import { LeadModel } from './lead.model.js'

export const ALLOWED_FOLLOW_UP_STATUSES = ['Due Today', 'Upcoming', 'Overdue', 'Completed', 'Dismissed']
export const ALLOWED_TASK_TYPES = ['Lead follow-up', 'Quotation follow-up', 'Payment collection', 'Meeting', 'Phone Call', 'WhatsApp']
export const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

/**
 * Normalizes a follow-up database row to match frontend and API contracts
 */
export function formatFollowUpRow(row) {
  if (!row) return null

  const dueStr = row.due_date 
    ? `${new Date(row.due_date).toISOString().split('T')[0]}${row.due_time ? ' ' + row.due_time : ''}`.trim()
    : 'Today'

  const status = row.status || 'Due Today'
  const statusClass = row.status_class || (
    status === 'Completed' ? 'bg-[#dcfce7] text-[#165A31]' :
    status === 'Overdue' ? 'bg-red-50 text-red-600' :
    status === 'Upcoming' ? 'bg-blue-50 text-blue-600' :
    'bg-[#fef3c7] text-[#b45309]'
  )

  const priority = row.priority || 'Medium'
  const priorityColor = row.priority_color || (
    priority === 'High' || priority === 'Urgent' ? 'bg-orange-50 text-orange-700' :
    priority === 'Low' ? 'bg-gray-50 text-gray-700' :
    'bg-blue-50 text-blue-700'
  )

  return {
    id: row.id,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    lead_id: row.lead_id || null,
    leadId: row.lead_id || null,
    customer_id: row.customer_id || null,
    customerId: row.customer_id || null,
    customer: row.customer_name,
    customer_name: row.customer_name,
    customerName: row.customer_name,
    phone: row.phone || '',
    linked_record_type: row.linked_record_type || 'Lead',
    linkedRecordType: row.linked_record_type || 'Lead',
    linked_record_id: row.linked_record_id || row.lead_id || null,
    linkedRecord: row.linked_record_id || row.lead_id || '',
    task_type: row.task_type || 'Lead follow-up',
    taskType: row.task_type || 'Lead follow-up',
    type: row.task_type || 'Lead follow-up',
    channel: row.channel || 'Phone Call',
    priority: priority,
    priorityColor: priorityColor,
    status: status,
    statusClass: statusClass,
    due: dueStr,
    due_date: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : null,
    dueDate: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : null,
    due_time: row.due_time || '12:00',
    dueTime: row.due_time || '12:00',
    owner: row.owner || 'Hamza',
    notes: row.notes || '',
    action: status === 'Completed' ? 'Completed' : 'Complete',
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const FollowUpModel = {
  /**
   * Find follow-ups with branch scoping, status filters, and search
   */
  async findFollowUps({ branch_id, status, lead_id, customer_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `follow_ups` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL') {
      const canonicalBranch = resolveBranchId(branch_id)
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(canonicalBranch, getBranchName(canonicalBranch))
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (lead_id) {
      sql += ' AND `lead_id` = ?'
      params.push(lead_id)
    }

    if (customer_id) {
      sql += ' AND `customer_id` = ?'
      params.push(customer_id)
    }

    if (search && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      sql += ' AND (`customer_name` LIKE ? OR `phone` LIKE ? OR `linked_record_id` LIKE ? OR `owner` LIKE ? OR `notes` LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY `due_date` ASC, `due_time` ASC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatFollowUpRow)
  },

  /**
   * Find a single follow-up by ID
   */
  async findFollowUpById(id) {
    if (!id) return null
    const rows = await query('SELECT * FROM `follow_ups` WHERE `id` = ? LIMIT 1', [id])
    if (rows.length === 0) return null
    return formatFollowUpRow(rows[0])
  },

  /**
   * Create a new follow-up with cross-branch reference validation
   */
  async createFollowUp(data, user) {
    const branchId = resolveBranchId(data.branch_id || data.branchId || data.branch || user?.branch_id || 'BR-01')
    const branchName = getBranchName(branchId)

    // 1. Validate linked lead if provided
    const leadId = data.lead_id || data.leadId || (data.linked_record_type === 'Lead' ? data.linked_record_id : null)
    if (leadId) {
      const lead = await LeadModel.findLeadById(leadId)
      if (!lead) {
        const err = new Error(`Linked lead "${leadId}" was not found.`)
        err.status = 404
        err.code = 'NOT_FOUND'
        throw err
      }
      if (resolveBranchId(lead.branch_id) !== branchId) {
        const err = new Error(`Cross-branch violation: Linked lead "${leadId}" belongs to branch "${lead.branch}", not "${branchName}".`)
        err.status = 400
        err.code = 'CROSS_BRANCH_REFERENCE'
        throw err
      }
    }

    // 2. Validate linked customer if provided
    const customerId = data.customer_id || data.customerId
    if (customerId) {
      const custRows = await query('SELECT id, branch_id, branch, name FROM `customers` WHERE `id` = ? LIMIT 1', [customerId])
      if (custRows.length === 0) {
        const err = new Error(`Linked customer "${customerId}" was not found.`)
        err.status = 404
        err.code = 'NOT_FOUND'
        throw err
      }
      const cust = custRows[0]
      if (resolveBranchId(cust.branch_id) !== branchId) {
        const err = new Error(`Cross-branch violation: Linked customer "${customerId}" belongs to branch "${cust.branch}", not "${branchName}".`)
        err.status = 400
        err.code = 'CROSS_BRANCH_REFERENCE'
        throw err
      }
    }

    // 3. Prepare fields
    const isExplicitId = Boolean(data.id)
    let id = data.id
    const customerName = (data.customer_name || data.customer || data.customerName || 'Customer').trim()
    const taskType = data.task_type || data.taskType || data.type || 'Lead follow-up'
    const channel = data.channel || 'Phone Call'
    const priority = data.priority || 'Medium'
    const status = data.status || 'Due Today'
    const statusClass = (
      status === 'Completed' ? 'bg-[#dcfce7] text-[#165A31]' :
      status === 'Overdue' ? 'bg-red-50 text-red-600' :
      status === 'Upcoming' ? 'bg-blue-50 text-blue-600' :
      'bg-[#fef3c7] text-[#b45309]'
    )
    const priorityColor = (
      priority === 'High' || priority === 'Urgent' ? 'bg-orange-50 text-orange-700' :
      priority === 'Low' ? 'bg-gray-50 text-gray-700' :
      'bg-blue-50 text-blue-700'
    )

    let dueDate = data.due_date || data.dueDate || null
    if (!dueDate && (data.due === 'Today' || status === 'Due Today')) {
      dueDate = new Date().toISOString().split('T')[0]
    } else if (!dueDate && data.due) {
      const match = String(data.due).match(/^\d{4}-\d{2}-\d{2}/)
      if (match) dueDate = match[0]
      else dueDate = new Date().toISOString().split('T')[0]
    }

    const maxAttempts = isExplicitId ? 1 : 5
    let lastErr = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!isExplicitId) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `FU-${Math.floor(1000 + Math.random() * 9000)}`
          const existing = await query('SELECT `id` FROM `follow_ups` WHERE `id` = ? LIMIT 1', [candidate])
          if (existing.length === 0) {
            id = candidate
            break
          }
          attempts++
        }
        if (!id) id = `FU-${Date.now().toString().slice(-6)}`
      }

      try {
        await query(`
          INSERT INTO \`follow_ups\` (
            \`id\`, \`branch_id\`, \`branch\`, \`lead_id\`, \`customer_id\`, \`customer_name\`,
            \`phone\`, \`linked_record_type\`, \`linked_record_id\`, \`task_type\`,
            \`channel\`, \`priority\`, \`priority_color\`, \`status\`, \`status_class\`,
            \`due_date\`, \`due_time\`, \`owner\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          branchId,
          branchName,
          leadId || null,
          customerId || null,
          customerName,
          data.phone || null,
          data.linked_record_type || data.linkedRecordType || (leadId ? 'Lead' : 'Customer'),
          data.linked_record_id || data.linkedRecord || leadId || customerId || null,
          taskType,
          channel,
          priority,
          priorityColor,
          status,
          statusClass,
          dueDate,
          data.due_time || data.dueTime || '12:00',
          data.owner || user?.name || 'Hamza',
          data.notes || null
        ])

        return await this.findFollowUpById(id)
      } catch (err) {
        lastErr = err
        if (!isExplicitId && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) && err.message?.includes('PRIMARY')) {
          id = null
          continue
        }
        throw err
      }
    }

    if (lastErr) throw lastErr
  },

  /**
   * Update an existing follow-up
   */
  async updateFollowUp(id, data, user) {
    const existing = await this.findFollowUpById(id)
    if (!existing) return null

    // If updating linked lead, validate branch
    const leadId = data.lead_id || data.leadId
    if (leadId !== undefined && leadId !== existing.lead_id) {
      if (leadId) {
        const lead = await LeadModel.findLeadById(leadId)
        if (!lead) {
          const err = new Error(`Linked lead "${leadId}" was not found.`)
          err.status = 404
          err.code = 'NOT_FOUND'
          throw err
        }
        if (resolveBranchId(lead.branch_id) !== resolveBranchId(existing.branch_id)) {
          const err = new Error(`Cross-branch violation: Lead "${leadId}" belongs to branch "${lead.branch}", not "${existing.branch}".`)
          err.status = 400
          err.code = 'CROSS_BRANCH_REFERENCE'
          throw err
        }
      }
    }

    const updates = []
    const params = []

    if (data.customer !== undefined || data.customer_name !== undefined) {
      updates.push('`customer_name` = ?')
      params.push(data.customer || data.customer_name)
    }

    if (data.phone !== undefined) {
      updates.push('`phone` = ?')
      params.push(data.phone)
    }

    if (data.task_type !== undefined || data.taskType !== undefined) {
      updates.push('`task_type` = ?')
      params.push(data.task_type || data.taskType)
    }

    if (data.channel !== undefined) {
      updates.push('`channel` = ?')
      params.push(data.channel)
    }

    if (data.priority !== undefined) {
      const priority = data.priority
      updates.push('`priority` = ?, `priority_color` = ?')
      const priorityColor = (
        priority === 'High' || priority === 'Urgent' ? 'bg-orange-50 text-orange-700' :
        priority === 'Low' ? 'bg-gray-50 text-gray-700' :
        'bg-blue-50 text-blue-700'
      )
      params.push(priority, priorityColor)
    }

    if (data.status !== undefined) {
      const status = data.status
      updates.push('`status` = ?, `status_class` = ?')
      const statusClass = (
        status === 'Completed' ? 'bg-[#dcfce7] text-[#165A31]' :
        status === 'Overdue' ? 'bg-red-50 text-red-600' :
        status === 'Upcoming' ? 'bg-blue-50 text-blue-600' :
        'bg-[#fef3c7] text-[#b45309]'
      )
      params.push(status, statusClass)
      if (status === 'Completed') {
        updates.push('`completed_at` = CURRENT_TIMESTAMP')
      }
    }

    if (data.due_date !== undefined || data.dueDate !== undefined) {
      updates.push('`due_date` = ?')
      params.push(data.due_date || data.dueDate)
    }

    if (data.due_time !== undefined || data.dueTime !== undefined) {
      updates.push('`due_time` = ?')
      params.push(data.due_time || data.dueTime)
    }

    if (data.owner !== undefined) {
      updates.push('`owner` = ?')
      params.push(data.owner)
    }

    if (data.notes !== undefined) {
      updates.push('`notes` = ?')
      params.push(data.notes)
    }

    if (data.lead_id !== undefined || data.leadId !== undefined) {
      updates.push('`lead_id` = ?')
      params.push(data.lead_id || data.leadId || null)
    }

    if (updates.length > 0) {
      params.push(existing.id)
      await query(`UPDATE \`follow_ups\` SET ${updates.join(', ')} WHERE \`id\` = ?`, params)
    }

    return await this.findFollowUpById(id)
  },

  /**
   * Complete follow-up task
   */
  async completeFollowUp(id) {
    const existing = await this.findFollowUpById(id)
    if (!existing) return null

    await query(`
      UPDATE \`follow_ups\`
      SET \`status\` = 'Completed',
          \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
          \`completed_at\` = CURRENT_TIMESTAMP
      WHERE \`id\` = ?
    `, [id])

    return await this.findFollowUpById(id)
  },

  /**
   * Delete follow-up
   */
  async deleteFollowUp(id) {
    if (!id) return false
    const res = await query('DELETE FROM \`follow_ups\` WHERE \`id\` = ?', [id])
    return res.affectedRows > 0
  }
}
