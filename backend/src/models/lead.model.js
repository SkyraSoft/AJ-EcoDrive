import { query, withTransaction } from '../config/db.js'
import { resolveBranchId, getBranchName } from '../utils/branchScope.js'
import { normalizePhoneNumber } from '../utils/phone.js'
import { formatCustomerRow } from './customer.model.js'

export const ALLOWED_LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Quoted', 'Converted', 'Lost']
export const ALLOWED_LEAD_SOURCES = ['Walk-in', 'Website', 'Social', 'Referral', 'Phone Inbound', 'Other']

/**
 * Normalizes a database row to match frontend and API contracts
 */
export function formatLeadRow(row) {
  if (!row) return null

  const rawBudget = parseFloat(row.budget_amount || 0)
  const budgetStr = row.budget || (rawBudget > 0 ? `PKR ${rawBudget.toLocaleString()}` : 'PKR 0')

  const stage = row.stage || row.status || 'New'
  const statusClass = row.status_class || (
    stage === 'Quoted' ? 'bg-[#dcfce7] text-[#165A31]' :
    stage === 'Converted' ? 'bg-[#eefcf2] text-[#165A31]' :
    stage === 'Lost' ? 'bg-red-50 text-red-600' :
    stage === 'Contacted' ? 'bg-[#fef3c7] text-[#b45309]' :
    'bg-[#eff6ff] text-[#2563eb]'
  )

  return {
    id: row.id,
    lead_id: row.id,
    leadNo: row.lead_number || row.id,
    lead_number: row.lead_number || row.id,
    name: row.customer_name,
    customer: row.customer_name,
    customer_name: row.customer_name,
    customerName: row.customer_name,
    phone: row.phone,
    displayPhone: row.phone,
    rawPhone: row.phone ? row.phone.replace(/\D/g, '') : '',
    email: row.email || '',
    city: row.city || '',
    source: row.source || 'Walk-in',
    owner: row.owner || 'Hamza',
    product_id: row.product_id || null,
    product: row.product_name || '',
    product_name: row.product_name || '',
    budget: budgetStr,
    budget_amount: rawBudget,
    rawBudget: rawBudget,
    stage: stage,
    status: stage,
    statusClass: statusClass,
    customer_id: row.customer_id || null,
    customerId: row.customer_id || null,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    nextFollowUp: row.next_follow_up || '',
    next_follow_up: row.next_follow_up || null,
    notes: row.notes || '',
    createdBy: row.created_by,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const LeadModel = {
  /**
   * Find all leads with optional branch scoping, stage/source filters, and text search
   */
  async findLeads({ branch_id, stage, status, source, product_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `leads` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL') {
      const canonicalBranch = resolveBranchId(branch_id)
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(canonicalBranch, getBranchName(canonicalBranch))
    }

    const targetStage = stage || status
    if (targetStage && targetStage !== 'All') {
      sql += ' AND (`stage` = ? OR `status` = ?)'
      params.push(targetStage, targetStage)
    }

    if (source && source !== 'All' && source !== 'All Sources') {
      sql += ' AND `source` = ?'
      params.push(source)
    }

    if (product_id && product_id !== 'All' && product_id !== 'All Products') {
      sql += ' AND (`product_id` = ? OR `product_name` = ?)'
      params.push(product_id, product_id)
    }

    if (search && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      sql += ' AND (`lead_number` LIKE ? OR `customer_name` LIKE ? OR `phone` LIKE ? OR `email` LIKE ? OR `city` LIKE ? OR `notes` LIKE ?)'
      params.push(term, term, term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatLeadRow)
  },

  /**
   * Find a single lead by ID or Lead Number
   */
  async findLeadById(id) {
    if (!id) return null
    const rows = await query('SELECT * FROM `leads` WHERE `id` = ? OR `lead_number` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null
    return formatLeadRow(rows[0])
  },

  /**
   * Find a lead by branch and normalized phone number (for duplicate checks)
   */
  async findLeadByBranchAndPhone(branch_id, phone) {
    if (!branch_id || !phone) return null
    const canonicalBranch = resolveBranchId(branch_id)
    const normalizedPhone = normalizePhoneNumber(phone)

    const rows = await query(
      'SELECT * FROM `leads` WHERE `branch_id` = ? AND `phone` = ? LIMIT 1',
      [canonicalBranch, normalizedPhone]
    )
    if (rows.length === 0) return null
    return formatLeadRow(rows[0])
  },

  /**
   * Create a new lead record
   */
  async createLead(data, user) {
    // 1. Resolve branch
    const branchId = resolveBranchId(data.branch_id || data.branchId || data.branch || user?.branch_id || 'BR-01')
    const branchName = getBranchName(branchId)

    // 2. Normalize and validate phone
    const normalizedPhone = normalizePhoneNumber(data.phone)
    if (!normalizedPhone) {
      const err = new Error('A valid phone number is required to register a lead.')
      err.status = 400
      err.code = 'VALIDATION_ERROR'
      throw err
    }

    // 3. Pre-check for duplicate phone in same branch
    const existing = await this.findLeadByBranchAndPhone(branchId, normalizedPhone)
    if (existing) {
      const err = new Error(`A lead with phone number "${normalizedPhone}" already exists in ${branchName} branch (Lead: ${existing.leadNo}). Duplicate leads within the same branch are not permitted.`)
      err.status = 409
      err.code = 'CONFLICT'
      throw err
    }

    // 4. Generate ID
    const leadId = data.id || data.lead_id || data.leadNo || `LD-${Math.floor(1000 + Math.random() * 9000)}`
    const leadNumber = data.lead_number || data.leadNo || leadId

    const customerName = (data.customer_name || data.customer || data.name || data.customerName || '').trim()
    const stage = data.stage || data.status || 'New'
    const statusClass = (
      stage === 'Quoted' ? 'bg-[#dcfce7] text-[#165A31]' :
      stage === 'Converted' ? 'bg-[#eefcf2] text-[#165A31]' :
      stage === 'Lost' ? 'bg-red-50 text-red-600' :
      stage === 'Contacted' ? 'bg-[#fef3c7] text-[#b45309]' :
      'bg-[#eff6ff] text-[#2563eb]'
    )

    let budgetAmount = 0
    if (data.budget_amount !== undefined) {
      budgetAmount = parseFloat(data.budget_amount) || 0
    } else if (data.rawBudget !== undefined) {
      budgetAmount = parseFloat(data.rawBudget) || 0
    } else if (data.budget) {
      budgetAmount = parseFloat(String(data.budget).replace(/[^0-9.]/g, '')) || 0
    }

    const budgetStr = data.budget || (budgetAmount > 0 ? `PKR ${budgetAmount.toLocaleString()}` : 'PKR 0')

    try {
      await query(`
        INSERT INTO \`leads\` (
          \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`email\`, \`city\`,
          \`source\`, \`owner\`, \`product_id\`, \`product_name\`, \`budget\`,
          \`budget_amount\`, \`stage\`, \`status\`, \`status_class\`, \`customer_id\`,
          \`branch_id\`, \`branch\`, \`next_follow_up\`, \`notes\`, \`created_by\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        leadId,
        leadNumber,
        customerName,
        normalizedPhone,
        data.email || null,
        data.city || null,
        data.source || 'Walk-in',
        data.owner || user?.name || 'Hamza',
        data.product_id || data.productId || null,
        data.product_name || data.product || null,
        budgetStr,
        budgetAmount,
        stage,
        stage,
        statusClass,
        data.customer_id || data.customerId || null,
        branchId,
        branchName,
        data.next_follow_up || data.nextFollowUp || null,
        data.notes || null,
        user?.username || user?.name || 'System'
      ])

      return await this.findLeadById(leadId)
    } catch (dbErr) {
      // Catch race-condition duplicate key error from MySQL constraint uniq_lead_branch_phone
      if (dbErr.code === 'ER_DUP_ENTRY') {
        const err = new Error(`A lead with phone number "${normalizedPhone}" already exists in ${branchName} branch. Duplicate leads within the same branch are not permitted.`)
        err.status = 409
        err.code = 'CONFLICT'
        throw err
      }
      throw dbErr
    }
  },

  /**
   * Update an existing lead record
   */
  async updateLead(id, data, user) {
    const existing = await this.findLeadById(id)
    if (!existing) return null

    const updates = []
    const params = []

    if (data.name !== undefined || data.customer !== undefined || data.customer_name !== undefined) {
      const name = (data.customer_name || data.customer || data.name || '').trim()
      if (name) {
        updates.push('`customer_name` = ?')
        params.push(name)
      }
    }

    if (data.phone !== undefined) {
      const normalizedPhone = normalizePhoneNumber(data.phone)
      if (!normalizedPhone) {
        const err = new Error('Phone number cannot be blank.')
        err.status = 400
        err.code = 'VALIDATION_ERROR'
        throw err
      }

      // Check if phone changed and conflicts with another lead in same branch
      if (normalizedPhone !== existing.phone) {
        const conflictRows = await query(
          'SELECT id, lead_number FROM `leads` WHERE `branch_id` = ? AND `phone` = ? AND `id` != ? LIMIT 1',
          [existing.branch_id, normalizedPhone, existing.id]
        )
        if (conflictRows.length > 0) {
          const err = new Error(`Phone number "${normalizedPhone}" is already registered to lead ${conflictRows[0].lead_number} in branch "${existing.branch}".`)
          err.status = 409
          err.code = 'CONFLICT'
          throw err
        }

        updates.push('`phone` = ?')
        params.push(normalizedPhone)
      }
    }

    if (data.email !== undefined) {
      updates.push('`email` = ?')
      params.push(data.email || null)
    }

    if (data.city !== undefined) {
      updates.push('`city` = ?')
      params.push(data.city || null)
    }

    if (data.source !== undefined) {
      updates.push('`source` = ?')
      params.push(data.source)
    }

    if (data.owner !== undefined) {
      updates.push('`owner` = ?')
      params.push(data.owner)
    }

    if (data.product_id !== undefined || data.productId !== undefined) {
      updates.push('`product_id` = ?')
      params.push(data.product_id || data.productId || null)
    }

    if (data.product !== undefined || data.product_name !== undefined) {
      updates.push('`product_name` = ?')
      params.push(data.product || data.product_name || null)
    }

    if (data.budget !== undefined || data.budget_amount !== undefined || data.rawBudget !== undefined) {
      let budgetAmount = 0
      if (data.budget_amount !== undefined) budgetAmount = parseFloat(data.budget_amount) || 0
      else if (data.rawBudget !== undefined) budgetAmount = parseFloat(data.rawBudget) || 0
      else if (data.budget) budgetAmount = parseFloat(String(data.budget).replace(/[^0-9.]/g, '')) || 0

      const budgetStr = data.budget || (budgetAmount > 0 ? `PKR ${budgetAmount.toLocaleString()}` : 'PKR 0')
      updates.push('`budget` = ?, `budget_amount` = ?')
      params.push(budgetStr, budgetAmount)
    }

    if (data.stage !== undefined || data.status !== undefined) {
      const stage = data.stage || data.status
      updates.push('`stage` = ?, `status` = ?')
      params.push(stage, stage)

      const statusClass = (
        stage === 'Quoted' ? 'bg-[#dcfce7] text-[#165A31]' :
        stage === 'Converted' ? 'bg-[#eefcf2] text-[#165A31]' :
        stage === 'Lost' ? 'bg-red-50 text-red-600' :
        stage === 'Contacted' ? 'bg-[#fef3c7] text-[#b45309]' :
        'bg-[#eff6ff] text-[#2563eb]'
      )
      updates.push('`status_class` = ?')
      params.push(statusClass)
    }

    if (data.customer_id !== undefined || data.customerId !== undefined) {
      updates.push('`customer_id` = ?')
      params.push(data.customer_id || data.customerId || null)
    }

    if (data.next_follow_up !== undefined || data.nextFollowUp !== undefined) {
      updates.push('`next_follow_up` = ?')
      params.push(data.next_follow_up || data.nextFollowUp || null)
    }

    if (data.notes !== undefined) {
      updates.push('`notes` = ?')
      params.push(data.notes || null)
    }

    if (updates.length > 0) {
      params.push(existing.id)
      try {
        await query(`UPDATE \`leads\` SET ${updates.join(', ')} WHERE \`id\` = ?`, params)
      } catch (dbErr) {
        if (dbErr.code === 'ER_DUP_ENTRY') {
          const err = new Error('Duplicate phone number within the same branch is not permitted.')
          err.status = 409
          err.code = 'CONFLICT'
          throw err
        }
        throw dbErr
      }
    }

    return await this.findLeadById(id)
  },

  /**
   * Delete lead (primarily for tests)
   */
  async deleteLead(id) {
    if (!id) return false
    const res = await query('DELETE FROM `leads` WHERE `id` = ?', [id])
    return res.affectedRows > 0
  },

  /**
   * Convert a qualified lead into a registered customer atomically
   */
  async convertLead(id, payload = {}, user) {
    return withTransaction(async (conn) => {
      // 1. Lock the lead row for update to serialize concurrent conversions
      const [leadRows] = await conn.execute(
        'SELECT * FROM `leads` WHERE `id` = ? OR `lead_number` = ? LIMIT 1 FOR UPDATE',
        [id, id]
      )

      if (leadRows.length === 0) {
        const err = new Error(`Lead "${id}" was not found.`)
        err.status = 404
        err.code = 'NOT_FOUND'
        throw err
      }

      const lead = leadRows[0]

      // 2. Branch isolation check
      const isSuperAdmin = user?.role === 'Super Admin' || user?.isSuperAdmin || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin) {
        const userBranch = resolveBranchId(user?.branch_id)
        if (lead.branch_id !== userBranch) {
          const err = new Error(`Access denied: You do not have permission to convert leads for branch "${lead.branch}".`)
          err.status = 403
          err.code = 'FORBIDDEN'
          throw err
        }
      }

      // 3. Repeated conversion check
      if (lead.customer_id || lead.stage === 'Converted') {
        const err = new Error(`Lead "${lead.lead_number}" has already been converted to customer "${lead.customer_id}".`)
        err.status = 400
        err.code = 'LEAD_ALREADY_CONVERTED'
        throw err
      }

      // 4. Determine customer fields
      const customerName = (payload.name || payload.customer_name || payload.customer || lead.customer_name || '').trim()
      const rawPhone = (payload.phone || lead.phone || '').trim()
      const normalizedPhone = normalizePhoneNumber(rawPhone)
      const digitsOnly = normalizedPhone.replace(/\D/g, '')

      const cnic = (payload.cnic || '').trim()
      const cleanedCnic = cnic ? cnic.replace(/[^0-9]/g, '') : null

      const email = (payload.email || lead.email || '').trim() || null
      const city = (payload.city || lead.city || 'Peshawar').trim()
      const address = (payload.address || '').trim() || null
      const customerType = payload.type || 'Individual'
      const notes = payload.notes || lead.notes || null

      // 5. Check for matching existing customer (by normalized phone, raw digits, or CNIC)
      let matchQuery = `
        SELECT * FROM \`customers\`
        WHERE \`phone\` = ?
           OR \`phone\` = ?
           OR REPLACE(REPLACE(REPLACE(REPLACE(\`phone\`, ' ', ''), '-', ''), '(', ''), ')', '') = ?
      `
      const matchParams = [normalizedPhone, rawPhone, digitsOnly]

      if (cleanedCnic && cleanedCnic.length === 13) {
        matchQuery += ' OR REPLACE(`cnic`, \'-\', \'\') = ? OR `cnic` = ?'
        matchParams.push(cleanedCnic, cnic)
      }

      matchQuery += ' LIMIT 1 FOR UPDATE'

      const [existingCustRows] = await conn.execute(matchQuery, matchParams)

      let targetCustomer = null
      let isExistingCustomer = false

      if (existingCustRows.length > 0) {
        const matchedCust = existingCustRows[0]

        // Branch check for matched customer
        if (matchedCust.branch_id !== lead.branch_id && !isSuperAdmin) {
          const err = new Error(`A customer with phone "${normalizedPhone}" already exists in branch "${matchedCust.branch}" (${matchedCust.branch_id}). Cross-branch customer linking is not permitted.`)
          err.status = 409
          err.code = 'CUSTOMER_BRANCH_MISMATCH'
          throw err
        }

        // Link to existing customer without modifying customer details
        targetCustomer = matchedCust
        isExistingCustomer = true
      } else {
        // Create new customer record with collision-free ID and code
        let custId = payload.id || payload.customer_id
        if (!custId) {
          let attempts = 0
          while (attempts < 10) {
            const candidate = `CUST-${Math.floor(1000 + Math.random() * 9000)}`
            const [chk] = await conn.execute('SELECT `id` FROM `customers` WHERE `id` = ? LIMIT 1', [candidate])
            if (chk.length === 0) {
              custId = candidate
              break
            }
            attempts++
          }
          if (!custId) custId = `CUST-${Date.now().toString().slice(-6)}`
        }

        let custCode = payload.code
        if (!custCode) {
          let attempts = 0
          while (attempts < 10) {
            const candidate = `CUS-${Math.floor(1000 + Math.random() * 9000)}`
            const [chk] = await conn.execute('SELECT `code` FROM `customers` WHERE `code` = ? LIMIT 1', [candidate])
            if (chk.length === 0) {
              custCode = candidate
              break
            }
            attempts++
          }
          if (!custCode) custCode = `CUS-${Date.now().toString().slice(-6)}`
        }

        // Split name into first and last name if possible
        const nameParts = customerName.split(' ')
        const firstName = payload.firstName || nameParts[0] || customerName
        const lastName = payload.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '')
        const formattedCnic = cleanedCnic && cleanedCnic.length === 13
          ? (cnic.includes('-') ? cnic : `${cleanedCnic.slice(0, 5)}-${cleanedCnic.slice(5, 12)}-${cleanedCnic.slice(12)}`)
          : null

        await conn.execute(`
          INSERT INTO \`customers\` (
            \`id\`, \`code\`, \`name\`, \`first_name\`, \`last_name\`, \`phone\`, \`email\`,
            \`cnic\`, \`address\`, \`city\`, \`branch_id\`, \`branch\`, \`type\`,
            \`status\`, \`status_class\`, \`spent\`, \`total_purchases\`, \`balance\`,
            \`outstanding\`, \`ltv\`, \`units\`, \`orders\`, \`orders_count\`, \`activity\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          custId,
          custCode,
          customerName,
          firstName || null,
          lastName || null,
          normalizedPhone,
          email,
          formattedCnic,
          address,
          city,
          lead.branch_id,
          lead.branch,
          customerType,
          'Active',
          'bg-[#dcfce7] text-[#165A31]',
          'PKR 0',
          'PKR 0',
          '0',
          'PKR 0',
          '0',
          0,
          0,
          0,
          `Converted from lead ${lead.lead_number}`,
          notes
        ])

        const [newCustRows] = await conn.execute('SELECT * FROM `customers` WHERE `id` = ?', [custId])
        targetCustomer = newCustRows[0]
        isExistingCustomer = false
      }

      // 6. Update lead's status/stage and link customer_id
      await conn.execute(`
        UPDATE \`leads\`
        SET \`customer_id\` = ?,
            \`stage\` = 'Converted',
            \`status\` = 'Converted',
            \`status_class\` = 'bg-[#eefcf2] text-[#165A31]',
            \`updated_at\` = CURRENT_TIMESTAMP
        WHERE \`id\` = ?
      `, [targetCustomer.id, lead.id])

      // 7. Update any pending follow-ups linked to this lead to also reference customer_id
      await conn.execute(`
        UPDATE \`follow_ups\`
        SET \`customer_id\` = ?
        WHERE \`lead_id\` = ? AND (\`customer_id\` IS NULL OR \`customer_id\` = '')
      `, [targetCustomer.id, lead.id])

      // 8. Fetch updated lead row
      const [updatedLeadRows] = await conn.execute('SELECT * FROM `leads` WHERE `id` = ?', [lead.id])

      return {
        lead: formatLeadRow(updatedLeadRows[0]),
        customer: formatCustomerRow(targetCustomer),
        isExistingCustomer
      }
    })
  }
}
