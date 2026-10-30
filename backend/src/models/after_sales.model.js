import { query, withTransaction } from '../config/db.js'
import { resolveBranchId, getBranchName } from '../utils/branchScope.js'

/**
 * Normalizes a service case row into frontend structure
 */
export function formatCaseRow(row) {
  if (!row) return null
  const totalCost = parseFloat(row.total_cost || 0)
  const covered = parseFloat(row.covered_by_warranty || 0)
  const payable = parseFloat(row.customer_payable || 0)

  return {
    id: row.id,
    caseId: row.case_number || row.id,
    case_id: row.id,
    case_number: row.case_number || row.id,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    customer_id: row.customer_id,
    customerId: row.customer_id,
    customer: row.customer_name,
    customerName: row.customer_name,
    customerPhone: row.customer_phone || '',
    customerEmail: row.customer_email || '',
    customerAddress: row.customer_address || '',
    unit_id: row.unit_id || '',
    unitId: row.unit_id || '',
    unit: row.unit_serial || row.unit_id || '',
    unitSerial: row.unit_serial || '',
    unitModel: row.unit_model || '',
    vin: row.vin || '',
    motorNo: row.motor_number || '',
    batterySerial: row.battery_serial || '',
    odometer: row.odometer || '',
    warranty_id: row.warranty_id || '',
    warrantyStatus: row.warranty_status || 'Active',
    warranty: row.warranty_status || 'Active',
    warrantyExpiry: row.warranty_expiry ? new Date(row.warranty_expiry).toISOString().split('T')[0] : null,
    warrantyEnd: row.warranty_expiry ? new Date(row.warranty_expiry).toISOString().split('T')[0] : '',
    category: row.category,
    type: row.category,
    issue: row.issue,
    complaint: row.issue,
    priority: row.priority,
    urgency: row.priority,
    status: row.status,
    statusClass: row.status_class || (row.status === 'Ready' || row.status === 'Resolved' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'),
    owner: row.owner || `${row.branch} Service Team`,
    assignedTech: row.assigned_tech || '',
    diagnosisSummary: row.diagnosis_summary || '',
    estimatedCompletion: row.estimated_completion || '',
    totalCost: `PKR ${totalCost.toLocaleString()}`,
    rawTotalCost: totalCost,
    coveredByWarranty: `PKR ${covered.toLocaleString()}`,
    rawCoveredByWarranty: covered,
    customerPayable: `PKR ${payable.toLocaleString()}`,
    rawCustomerPayable: payable,
    notes: row.notes || '',
    opened: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Today',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a repair job item row
 */
export function formatRepairItemRow(row) {
  if (!row) return null
  const qty = parseFloat(row.quantity || 1)
  const price = parseFloat(row.unit_price || 0)
  const subtotal = parseFloat(row.subtotal !== undefined && row.subtotal !== null ? row.subtotal : qty * price)

  return {
    id: row.id,
    repair_job_id: row.repair_job_id,
    itemType: row.item_type,
    item_type: row.item_type,
    productId: row.product_id,
    product_id: row.product_id,
    itemName: row.item_name,
    part: row.item_name,
    work: row.item_name,
    sku: row.sku,
    quantity: qty,
    qty: qty,
    hours: row.item_type === 'labour' ? qty : undefined,
    unitPrice: price,
    rate: `PKR ${price.toLocaleString()}${row.item_type === 'labour' ? '/hr' : ''}`,
    rawUnitPrice: price,
    subtotal: subtotal,
    cost: `PKR ${subtotal.toLocaleString()}`,
    rawCost: subtotal,
    total: `PKR ${subtotal.toLocaleString()}`,
    rawTotal: subtotal,
    isWarrantyCovered: Boolean(row.is_warranty_covered),
    covered: row.is_warranty_covered ? 'Warranty' : 'Paid',
    coverageStatus: row.coverage_status || (row.is_warranty_covered ? 'Warranty' : 'Paid'),
    source: row.source || 'Service Stock',
    status: row.status || 'Allocated'
  }
}

/**
 * Normalizes a repair job row into frontend structure
 */
export function formatRepairJobRow(row, items = []) {
  if (!row) return null
  const partsCost = parseFloat(row.parts_cost || 0)
  const labourCost = parseFloat(row.labour_cost || 0)
  const totalCost = parseFloat(row.total_cost || 0)
  const warrantyCov = parseFloat(row.warranty_coverage || 0)
  const customerPayable = parseFloat(row.customer_payable || 0)

  let workPlan = []
  if (row.work_plan) {
    try {
      workPlan = typeof row.work_plan === 'string' ? JSON.parse(row.work_plan) : row.work_plan
    } catch {
      workPlan = []
    }
  }

  const partsList = items.filter(i => i.item_type === 'part').map(formatRepairItemRow)
  const labourList = items.filter(i => i.item_type === 'labour').map(formatRepairItemRow)

  return {
    id: row.id,
    repairId: row.job_number || row.id,
    jobId: row.job_number || row.id,
    repair_id: row.id,
    job_number: row.job_number || row.id,
    case_id: row.case_id || '',
    caseRef: row.case_id || '',
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    customer_id: row.customer_id,
    customerId: row.customer_id,
    customer: row.customer_name,
    customerName: row.customer_name,
    customerPhone: row.customer_phone || '',
    unit_id: row.unit_id || '',
    unitId: row.unit_id || '',
    unit: row.unit_serial || row.unit_id || '',
    unitSerial: row.unit_serial || '',
    unitModel: row.unit_model || '',
    vin: row.vin || '',
    warranty_id: row.warranty_id || '',
    warrantyStatus: row.warranty_status || 'Pending Verification',
    technician: row.technician || '',
    assignedTech: row.technician || '',
    diagnosis: row.diagnosis || '',
    fault: row.fault || '',
    decision: row.decision || '',
    status: row.status,
    statusClass: row.status_class || (row.status === 'Ready' || row.status === 'Completed' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#92400e]'),
    customerApprovalStatus: row.customer_approval_status || 'Pending',
    customerApproval: {
      status: row.customer_approval_status || 'Pending',
      approvedBy: row.customer_name,
      method: 'In-Person Intake Form'
    },
    readyDate: row.ready_date || '',
    promised: row.promised_date || row.ready_date || '',
    posted_to_finance: Boolean(row.posted_to_finance),
    finance_invoice_id: row.invoice_id || null,
    invoice_id: row.invoice_id || null,
    partsList,
    labourList,
    workPlan,
    costSummary: {
      partsTotal: `PKR ${partsCost.toLocaleString()}`,
      rawPartsTotal: partsCost,
      labourTotal: `PKR ${labourCost.toLocaleString()}`,
      rawLabourTotal: labourCost,
      subtotal: `PKR ${totalCost.toLocaleString()}`,
      rawSubtotal: totalCost,
      total: `PKR ${totalCost.toLocaleString()}`,
      rawTotal: totalCost,
      warrantyCoverage: `PKR ${warrantyCov.toLocaleString()}`,
      rawWarrantyCoverage: warrantyCov,
      customerPayable: `PKR ${customerPayable.toLocaleString()}`,
      rawCustomerPayable: customerPayable
    },
    warrantyCoverage: {
      status: row.warranty_status || 'Pending Verification',
      payable: `PKR ${customerPayable.toLocaleString()}`
    },
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a warranty claim row
 */
export function formatWarrantyClaimRow(row) {
  if (!row) return null
  const amount = parseFloat(row.claim_amount || 0)

  return {
    id: row.id,
    claimNumber: row.claim_number || row.id,
    claim_number: row.claim_number || row.id,
    case_id: row.case_id || '',
    caseId: row.case_id || '',
    repair_job_id: row.repair_job_id || '',
    repairJobId: row.repair_job_id || '',
    branch_id: row.branch_id,
    branch: row.branch,
    unit_id: row.unit_id || '',
    vin: row.vin || '',
    customer_id: row.customer_id,
    customer: row.customer_name,
    claimDate: row.claim_date ? new Date(row.claim_date).toISOString().split('T')[0] : 'Today',
    claimAmount: `PKR ${amount.toLocaleString()}`,
    rawClaimAmount: amount,
    coveragePolicy: row.coverage_policy || 'Full System 2-Year OEM Warranty',
    status: row.status || 'Pending',
    statusClass: row.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : (row.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-[#fef3c7] text-[#b45309]'),
    decision: row.decision || '',
    authorizedBy: row.authorized_by || '',
    rejectionReason: row.rejection_reason || '',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

export const AfterSalesModel = {
  // ==========================================================================
  // 1. SERVICE CASES
  // ==========================================================================

  async findCases({ branch_id, status, priority, category, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `service_cases` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, getBranchName(branch_id))
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (priority && priority !== 'All') {
      sql += ' AND `priority` = ?'
      params.push(priority)
    }

    if (category && category !== 'All') {
      sql += ' AND `category` = ?'
      params.push(category)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      sql += ' AND (`case_number` LIKE ? OR `customer_name` LIKE ? OR `unit_serial` LIKE ? OR `vin` LIKE ? OR `issue` LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatCaseRow)
  },

  async findCaseById(id) {
    if (!id) return null
    const rows = await query('SELECT * FROM `service_cases` WHERE `id` = ? OR `case_number` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null
    return formatCaseRow(rows[0])
  },

  async createCase(data, user) {
    const branchId = resolveBranchId(data.branch_id || data.branch || user?.branch_id || 'BR-01')
    const branchName = getBranchName(branchId)

    // Generate or format Case ID
    let caseId = data.id || data.caseId
    if (!caseId) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `SC-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await query('SELECT `id` FROM `service_cases` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          caseId = candidate
          break
        }
        attempts++
      }
      if (!caseId) caseId = `SC-${Date.now().toString().slice(-6)}`
    }
    const caseNumber = data.case_number || caseId

    const totalCost = parseFloat(data.rawTotalCost || (data.totalCost ? String(data.totalCost).replace(/[^0-9.]/g, '') : 0)) || 0
    const covered = parseFloat(data.rawCoveredByWarranty || (data.coveredByWarranty ? String(data.coveredByWarranty).replace(/[^0-9.]/g, '') : 0)) || 0
    const payable = parseFloat(data.rawCustomerPayable || (data.customerPayable ? String(data.customerPayable).replace(/[^0-9.]/g, '') : 0)) || 0

    return await withTransaction(async (conn) => {
      // Validate customer existence if provided
      if (data.customer_id) {
        const [cust] = await conn.query('SELECT `id`, `name`, `phone` FROM `customers` WHERE `id` = ? LIMIT 1', [data.customer_id])
        if (cust && cust.length > 0) {
          if (!data.customer_name && !data.customer) {
            data.customer_name = cust[0].name
          }
        }
      }

      // Check unit warranty expiry if unit_id or vin provided
      let warrantyExpiry = data.warrantyExpiry || data.warrantyEnd || null
      let warrantyStatus = data.warrantyStatus || data.warranty || 'Active'

      if (data.unit_id || data.vin) {
        const [units] = await conn.query('SELECT * FROM `serialized_units` WHERE `unit_id` = ? OR `vin` = ? OR `serial_number` = ? LIMIT 1', [
          data.unit_id || '', data.vin || '', data.unit_serial || data.unit || ''
        ])
        if (units && units.length > 0) {
          const unit = units[0]
          warrantyExpiry = unit.warranty_expiry || warrantyExpiry
          if (warrantyExpiry) {
            const expDate = new Date(warrantyExpiry)
            const isExpired = expDate < new Date()
            if (isExpired && warrantyStatus === 'Active') {
              warrantyStatus = 'Expired / Paid'
            }
          }
          // Set unit status to Maintenance
          await conn.query('UPDATE `serialized_units` SET `status` = "Maintenance", `status_class` = "bg-[#fef3c7] text-[#b45309]" WHERE `id` = ?', [unit.id])
        }
      }

      const status = data.status || 'Diagnosis'
      const statusClass = status === 'Ready' || status === 'Resolved'
        ? 'bg-[#dcfce7] text-[#165A31]'
        : 'bg-[#fef3c7] text-[#b45309]'

      await conn.query(`
        INSERT INTO \`service_cases\` (
          \`id\`, \`case_number\`, \`branch_id\`, \`branch\`, \`customer_id\`, \`customer_name\`,
          \`customer_phone\`, \`customer_email\`, \`customer_address\`, \`unit_id\`, \`vin\`,
          \`unit_serial\`, \`unit_model\`, \`motor_number\`, \`battery_serial\`, \`odometer\`,
          \`warranty_id\`, \`warranty_status\`, \`warranty_expiry\`, \`category\`, \`issue\`,
          \`priority\`, \`status\`, \`status_class\`, \`owner\`, \`assigned_tech\`,
          \`diagnosis_summary\`, \`estimated_completion\`, \`total_cost\`, \`covered_by_warranty\`,
          \`customer_payable\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        caseId,
        caseNumber,
        branchId,
        branchName,
        data.customer_id || 'CUST-101',
        data.customer_name || data.customer || 'Customer',
        data.customer_phone || data.customerPhone || null,
        data.customer_email || data.customerEmail || null,
        data.customer_address || data.customerAddress || null,
        data.unit_id || null,
        data.vin || null,
        data.unit_serial || data.unitSerial || data.unit || null,
        data.unit_model || data.unitModel || null,
        data.motor_number || data.motorNo || null,
        data.battery_serial || data.batterySerial || null,
        data.odometer || null,
        data.warranty_id || 'WAR-101',
        warrantyStatus,
        warrantyExpiry,
        data.category || data.type || 'Electrical',
        data.issue || data.complaint || 'Diagnostic inspection requested',
        data.priority || data.urgency || 'Medium',
        status,
        statusClass,
        data.owner || `${branchName} Service Team`,
        data.assigned_tech || data.assignedTech || null,
        data.diagnosis_summary || data.diagnosisSummary || `Case registered at ${branchName}.`,
        data.estimated_completion || data.estimatedCompletion || null,
        totalCost,
        covered,
        payable,
        data.notes || null
      ])

      const [created] = await conn.query('SELECT * FROM `service_cases` WHERE `id` = ? LIMIT 1', [caseId])
      return formatCaseRow(created[0])
    })
  },

  async updateCase(id, data, user) {
    const existing = await this.findCaseById(id)
    if (!existing) return null

    const updates = []
    const params = []

    if (data.status !== undefined) {
      updates.push('`status` = ?')
      params.push(data.status)
      const statusClass = (data.status === 'Ready' || data.status === 'Resolved')
        ? 'bg-[#dcfce7] text-[#165A31]'
        : 'bg-[#fef3c7] text-[#b45309]'
      updates.push('`status_class` = ?')
      params.push(statusClass)

      // If resolved or ready, restore unit status if in maintenance
      if (['Resolved', 'Closed', 'Ready'].includes(data.status) && existing.unit_id) {
        await query('UPDATE `serialized_units` SET `status` = "Available", `status_class` = "bg-[#dcfce7] text-[#165A31]" WHERE (`unit_id` = ? OR `vin` = ?) AND `status` = "Maintenance"', [
          existing.unit_id, existing.vin || ''
        ])
      }
    }

    if (data.priority !== undefined) {
      updates.push('`priority` = ?')
      params.push(data.priority)
    }

    if (data.assigned_tech !== undefined || data.assignedTech !== undefined) {
      updates.push('`assigned_tech` = ?')
      params.push(data.assigned_tech || data.assignedTech)
    }

    if (data.diagnosis_summary !== undefined || data.diagnosisSummary !== undefined) {
      updates.push('`diagnosis_summary` = ?')
      params.push(data.diagnosis_summary || data.diagnosisSummary)
    }

    if (data.estimated_completion !== undefined || data.estimatedCompletion !== undefined) {
      updates.push('`estimated_completion` = ?')
      params.push(data.estimated_completion || data.estimatedCompletion)
    }

    if (data.notes !== undefined) {
      updates.push('`notes` = ?')
      params.push(data.notes)
    }

    if (updates.length === 0) return existing

    params.push(id, id)
    await query(`UPDATE \`service_cases\` SET ${updates.join(', ')} WHERE \`id\` = ? OR \`case_number\` = ?`, params)
    return await this.findCaseById(id)
  },

  // ==========================================================================
  // 2. REPAIR JOBS
  // ==========================================================================

  async findRepairJobs({ branch_id, status, technician, case_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `repair_jobs` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, getBranchName(branch_id))
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (technician && technician !== 'All Technicians') {
      sql += ' AND `technician` = ?'
      params.push(technician)
    }

    if (case_id) {
      sql += ' AND `case_id` = ?'
      params.push(case_id)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      sql += ' AND (`job_number` LIKE ? OR `customer_name` LIKE ? OR `unit_serial` LIKE ? OR `diagnosis` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    if (rows.length === 0) return []

    // Fetch line items in batch
    const jobIds = rows.map(r => r.id)
    const placeholders = jobIds.map(() => '?').join(',')
    const items = await query(`SELECT * FROM \`repair_job_items\` WHERE \`repair_job_id\` IN (${placeholders})`, jobIds)

    const itemsByJob = {}
    items.forEach(item => {
      if (!itemsByJob[item.repair_job_id]) itemsByJob[item.repair_job_id] = []
      itemsByJob[item.repair_job_id].push(item)
    })

    return rows.map(r => formatRepairJobRow(r, itemsByJob[r.id] || []))
  },

  async findRepairJobById(id) {
    if (!id) return null
    const rows = await query('SELECT * FROM `repair_jobs` WHERE `id` = ? OR `job_number` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null
    const job = rows[0]

    const items = await query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ? ORDER BY `id` ASC', [job.id])
    return formatRepairJobRow(job, items)
  },

  async createRepairJob(data, user) {
    const branchId = resolveBranchId(data.branch_id || data.branch || user?.branch_id || 'BR-01')
    const branchName = getBranchName(branchId)

    let jobId = data.id || data.repairId || data.jobId
    if (!jobId) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `RJ-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await query('SELECT `id` FROM `repair_jobs` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          jobId = candidate
          break
        }
        attempts++
      }
      if (!jobId) jobId = `RJ-${Date.now().toString().slice(-6)}`
    }
    const jobNumber = data.job_number || jobId

    let partsList = Array.isArray(data.partsList) ? data.partsList : []
    if (partsList.length === 0 && Array.isArray(data.items)) {
      partsList = data.items.map(p => ({
        part_id: p.part_id || p.productId || p.product_id || 'PROD-001',
        part: p.part_name || p.part || p.itemName || p.item_name || 'Part',
        sku: p.sku || 'SKU-GEN',
        qty: parseFloat(p.quantity || p.qty || 1),
        cost: parseFloat(p.unit_price || p.unitPrice || p.cost || 0),
        is_warranty: p.is_warranty !== undefined ? p.is_warranty : (p.isWarrantyCovered ? 1 : 0)
      }))
    }

    let labourList = Array.isArray(data.labourList) ? data.labourList : []
    if (labourList.length === 0 && (data.labor_hours || data.labor_rate || data.labour_hours || data.labour_rate)) {
      const hours = parseFloat(data.labor_hours || data.labour_hours || 1)
      const rate = parseFloat(data.labor_rate || data.labour_rate || 2500)
      labourList = [{
        work: 'Inspection & Repair Labour',
        task: 'Inspection & Repair Labour',
        hours,
        rate,
        isWarrantyCovered: false
      }]
    }

    // Compute costs
    let partsCost = 0
    partsList.forEach(p => {
      const qty = parseFloat(p.qty || p.quantity || 1)
      const cost = parseFloat(p.rawCost ?? p.cost ?? p.unitPrice ?? p.unit_price ?? 0)
      partsCost += qty * cost
    })

    let labourCost = 0
    labourList.forEach(l => {
      const hours = parseFloat(l.hours || l.rawHours || 1)
      const rate = parseFloat(l.rawRate ?? l.rate ?? l.cost ?? 0)
      labourCost += hours * rate
    })

    const totalCost = partsCost + labourCost
    const isWarranty = String(data.warrantyStatus || '').includes('Covered') ||
                       String(data.warrantyStatus || '').includes('100%') ||
                       String(data.warrantyStatus || '').toLowerCase() === 'active'

    const warrantyCov = isWarranty ? totalCost : 0
    const customerPayable = Math.max(0, totalCost - warrantyCov)

    const workPlan = data.workPlan || [
      { id: 1, task: 'Intake scan & diagnostic verification', status: 'In Progress', time: 'Just now' }
    ]

    return await withTransaction(async (conn) => {
      // Validate customer existence
      if (data.customer_id) {
        const [cust] = await conn.query('SELECT `id`, `name`, `phone` FROM `customers` WHERE `id` = ? LIMIT 1', [data.customer_id])
        if (cust && cust.length > 0 && !data.customer_name && !data.customer) {
          data.customer_name = cust[0].name
        }
      }

      await conn.query(`
        INSERT INTO \`repair_jobs\` (
          \`id\`, \`job_number\`, \`case_id\`, \`branch_id\`, \`branch\`, \`customer_id\`, \`customer_name\`,
          \`customer_phone\`, \`unit_id\`, \`unit_serial\`, \`unit_model\`, \`vin\`,
          \`warranty_id\`, \`warranty_status\`, \`technician\`, \`diagnosis\`, \`fault\`,
          \`decision\`, \`status\`, \`status_class\`, \`customer_approval_status\`,
          \`ready_date\`, \`promised_date\`, \`parts_cost\`, \`labour_cost\`, \`total_cost\`,
          \`warranty_coverage\`, \`customer_payable\`, \`posted_to_finance\`, \`invoice_id\`,
          \`work_plan\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        jobId,
        jobNumber,
        data.case_id || data.caseRef || null,
        branchId,
        branchName,
        data.customer_id || 'CUST-101',
        data.customer_name || data.customer || 'Customer',
        data.customer_phone || data.customerPhone || null,
        data.unit_id || null,
        data.unit_serial || data.unitSerial || data.unit || null,
        data.unit_model || data.unitModel || null,
        data.vin || null,
        data.warranty_id || 'WAR-101',
        data.warrantyStatus || (isWarranty ? 'Active' : 'Pending Verification'),
        data.technician || data.assignedTech || 'Technician',
        data.diagnosis || data.diagnosis_notes || 'Inspection and diagnostic routine',
        data.fault || null,
        data.decision || null,
        data.status || 'In Progress',
        data.status === 'Ready' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-blue-50 text-blue-700',
        data.customerApprovalStatus || 'Pending',
        data.readyDate || data.promised || 'Tomorrow',
        data.readyDate || data.promised || 'Tomorrow',
        partsCost,
        labourCost,
        totalCost,
        warrantyCov,
        customerPayable,
        0,
        null,
        JSON.stringify(workPlan),
        data.notes || null
      ])

      // Insert parts items
      for (const p of partsList) {
        const qty = parseFloat(p.qty || p.quantity || 1)
        const price = parseFloat(p.rawCost ?? p.cost ?? p.unitPrice ?? p.unit_price ?? 0)
        await conn.query(`
          INSERT INTO \`repair_job_items\` (
            \`repair_job_id\`, \`item_type\`, \`product_id\`, \`item_name\`, \`sku\`,
            \`quantity\`, \`unit_price\`, \`subtotal\`, \`is_warranty_covered\`, \`coverage_status\`, \`source\`, \`status\`
          ) VALUES (?, 'part', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          jobId,
          p.product_id || p.productId || null,
          p.part || p.item || p.itemName || 'Spare Part Item',
          p.sku || null,
          qty,
          price,
          qty * price,
          p.isWarrantyCovered !== undefined ? (p.isWarrantyCovered ? 1 : 0) : (isWarranty ? 1 : 0),
          isWarranty ? 'Warranty' : 'Paid',
          p.source || 'Service Stock',
          'Allocated'
        ])
      }

      // Insert labour items
      for (const l of labourList) {
        const hours = parseFloat(l.hours || l.rawHours || 1)
        const rate = parseFloat(l.rawRate ?? l.rate ?? l.cost ?? 0)
        await conn.query(`
          INSERT INTO \`repair_job_items\` (
            \`repair_job_id\`, \`item_type\`, \`product_id\`, \`item_name\`, \`sku\`,
            \`quantity\`, \`unit_price\`, \`subtotal\`, \`is_warranty_covered\`, \`coverage_status\`, \`source\`, \`status\`
          ) VALUES (?, 'labour', NULL, ?, NULL, ?, ?, ?, ?, ?, 'Service Bay', 'Allocated')
        `, [
          jobId,
          l.work || l.description || l.itemName || 'Workshop Labour Operation',
          hours,
          rate,
          hours * rate,
          l.isWarrantyCovered !== undefined ? (l.isWarrantyCovered ? 1 : 0) : (isWarranty ? 1 : 0),
          isWarranty ? 'Warranty' : 'Paid'
        ])
      }

      // Link repair job to service case if case_id provided
      if (data.case_id || data.caseRef) {
        const caseRef = data.case_id || data.caseRef
        await conn.query('UPDATE `service_cases` SET `status` = "In Progress", `status_class` = "bg-blue-50 text-blue-600" WHERE (`id` = ? OR `case_number` = ?) AND `status` = "Diagnosis"', [caseRef, caseRef])
      }

      const [createdJob] = await conn.query('SELECT * FROM `repair_jobs` WHERE `id` = ? LIMIT 1', [jobId])
      const [createdItems] = await conn.query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ?', [jobId])
      return formatRepairJobRow(createdJob[0], createdItems)
    })
  },

  async updateRepairJob(id, data, user) {
    const existing = await this.findRepairJobById(id)
    if (!existing) return null

    // Immutable check: completed repairs cannot be modified
    if (existing.status === 'Completed') {
      const err = new Error(`Cannot modify repair job "${id}" because it is already completed and closed.`)
      err.status = 409
      throw err
    }

    const updates = []
    const params = []

    if (data.status !== undefined) {
      updates.push('`status` = ?')
      params.push(data.status)
      const statusClass = (data.status === 'Ready' || data.status === 'Completed')
        ? 'bg-[#dcfce7] text-[#15803d]'
        : (data.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]')
      updates.push('`status_class` = ?')
      params.push(statusClass)
    }

    if (data.technician !== undefined) {
      updates.push('`technician` = ?')
      params.push(data.technician)
    }

    if (data.diagnosis !== undefined) {
      updates.push('`diagnosis` = ?')
      params.push(data.diagnosis)
    }

    if (data.fault !== undefined) {
      updates.push('`fault` = ?')
      params.push(data.fault)
    }

    if (data.decision !== undefined) {
      updates.push('`decision` = ?')
      params.push(data.decision)
    }

    if (data.readyDate !== undefined || data.promised !== undefined) {
      updates.push('`ready_date` = ?')
      params.push(data.readyDate || data.promised)
    }

    if (data.customerApprovalStatus !== undefined) {
      updates.push('`customer_approval_status` = ?')
      params.push(data.customerApprovalStatus)
    }

    if (data.notes !== undefined) {
      updates.push('`notes` = ?')
      params.push(data.notes)
    }

    if (updates.length > 0) {
      params.push(existing.id)
      await query(`UPDATE \`repair_jobs\` SET ${updates.join(', ')} WHERE \`id\` = ?`, params)
    }

    return await this.findRepairJobById(id)
  },

  /**
   * ATOMIC TRANSACTION: Complete repair job and consume inventory spare parts
   */
  async completeRepairJob(id, { user, notes } = {}) {
    return await withTransaction(async (conn) => {
      // 1. Lock repair job row
      const [jobs] = await conn.query('SELECT * FROM `repair_jobs` WHERE `id` = ? OR `job_number` = ? FOR UPDATE', [id, id])
      if (!jobs || jobs.length === 0) {
        const err = new Error(`Repair job with ID "${id}" was not found.`)
        err.status = 404
        throw err
      }
      const job = jobs[0]

      // 2. Prevent re-completion of already completed job
      if (job.status === 'Completed') {
        const err = new Error(`Repair job "${id}" is already completed and closed. Duplicate completion is not allowed.`)
        err.status = 409
        throw err
      }

      // 3. Retrieve parts consumed by this repair job
      const [partItems] = await conn.query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ? AND `item_type` = "part"', [job.id])

      // 4. Validate inventory stock availability and deduct
      for (const item of partItems) {
        if (!item.product_id) continue

        const [stocks] = await conn.query('SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE', [
          item.product_id, job.branch_id
        ])

        if (!stocks || stocks.length === 0) {
          const err = new Error(`Spare part "${item.item_name}" (${item.product_id}) is not stocked at branch "${job.branch}". Cannot complete repair.`)
          err.status = 400
          throw err
        }

        const stock = stocks[0]
        const requiredQty = parseInt(item.quantity || 1, 10)
        const onHandBefore = parseInt(stock.on_hand || 0, 10)

        if (onHandBefore < requiredQty) {
          const err = new Error(`Insufficient inventory stock for spare part "${item.item_name}". Required: ${requiredQty}, on hand: ${onHandBefore}.`)
          err.status = 400
          throw err
        }

        const onHandAfter = onHandBefore - requiredQty
        const availableAfter = Math.max(0, parseInt(stock.available || 0, 10) - requiredQty)

        // Decrement stock
        await conn.query('UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ? WHERE `id` = ?', [
          onHandAfter, availableAfter, stock.id
        ])

        // Record stock movement ledger entry
        const movNum = `MOV-REP-${job.id}-${item.id}`
        await conn.query(`
          INSERT INTO \`stock_movements\` (
            \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
            \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
            \`user\`, \`reason\`, \`notes\`
          ) VALUES (?, 'REPAIR_CONSUMPTION', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          movNum,
          job.id,
          item.product_id,
          item.item_name,
          job.unit_serial || job.unit_id || null,
          job.branch_id,
          job.branch,
          -requiredQty,
          onHandBefore,
          onHandAfter,
          user?.name || 'Technician',
          `Spare part consumed for repair job ${job.id}`,
          notes || `Installed on unit ${job.unit_serial || job.unit_id || 'EV'}`
        ])

        // Update item status
        await conn.query('UPDATE `repair_job_items` SET `status` = "Installed" WHERE `id` = ?', [item.id])
      }

      // 5. Update unit status in serialized_units from Maintenance back to Available or Customer Owned
      if (job.unit_id || job.vin) {
        await conn.query(`
          UPDATE \`serialized_units\`
          SET \`status\` = 'Available', \`status_class\` = 'bg-[#dcfce7] text-[#165A31]'
          WHERE (\`unit_id\` = ? OR \`vin\` = ? OR \`serial_number\` = ?) AND \`status\` = 'Maintenance'
        `, [job.unit_id || '', job.vin || '', job.unit_serial || ''])
      }

      // 6. Update repair job status to Completed
      await conn.query(`
        UPDATE \`repair_jobs\`
        SET \`status\` = 'Completed',
            \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
            \`completed_at\` = CURRENT_TIMESTAMP,
            \`notes\` = COALESCE(?, \`notes\`)
        WHERE \`id\` = ?
      `, [notes || null, job.id])

      // 7. Update linked service case if present
      if (job.case_id) {
        await conn.query(`
          UPDATE \`service_cases\`
          SET \`status\` = 'Ready',
              \`status_class\` = 'bg-[#dcfce7] text-[#165A31]'
          WHERE (\`id\` = ? OR \`case_number\` = ?) AND \`status\` != 'Resolved'
        `, [job.case_id, job.case_id])
      }

      const [completedJob] = await conn.query('SELECT * FROM `repair_jobs` WHERE `id` = ? LIMIT 1', [job.id])
      const [items] = await conn.query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ?', [job.id])
      return formatRepairJobRow(completedJob[0], items)
    })
  },

  /**
   * FINANCE INTEGRATION: Post chargeable repair job to Finance as Sales Invoice
   */
  async postRepairToFinance(id, user) {
    return await withTransaction(async (conn) => {
      // 1. Lock repair job row
      const [jobs] = await conn.query('SELECT * FROM `repair_jobs` WHERE `id` = ? OR `job_number` = ? FOR UPDATE', [id, id])
      if (!jobs || jobs.length === 0) {
        const err = new Error(`Repair job "${id}" was not found.`)
        err.status = 404
        throw err
      }
      const job = jobs[0]

      // 2. Prevent duplicate invoice posting
      if (job.posted_to_finance) {
        const err = new Error(`Repair job "${id}" has already been posted to finance (Invoice: ${job.invoice_id || 'INV-REP'}). Duplicate posting rejected.`)
        err.status = 409
        throw err
      }

      const customerPayable = parseFloat(job.customer_payable || 0)
      const totalCost = parseFloat(job.total_cost || 0)
      const warrantyCoverage = parseFloat(job.warranty_coverage || 0)

      // 3. For 100% warranty repairs with zero customer payable, mark posted without creating customer receivable
      if (customerPayable <= 0) {
        await conn.query('UPDATE `repair_jobs` SET `posted_to_finance` = 1 WHERE `id` = ?', [job.id])
        return {
          success: true,
          posted: true,
          warrantyCovered: true,
          payable: 0,
          invoiceId: null,
          message: `Repair job "${job.id}" is fully covered under warranty (PKR ${warrantyCoverage.toLocaleString()}). No customer-payable invoice generated.`
        }
      }

      // 4. For chargeable repair, generate commercial invoice in `invoices` table
      const invoiceNumber = `INV-REP-${job.job_number || job.id}`
      const invoiceId = invoiceNumber

      // Check if invoice already exists to ensure idempotency
      const [existingInv] = await conn.query('SELECT `id` FROM `invoices` WHERE `id` = ? OR `invoice_number` = ? LIMIT 1', [invoiceId, invoiceNumber])
      if (existingInv && existingInv.length > 0) {
        await conn.query('UPDATE `repair_jobs` SET `posted_to_finance` = 1, `invoice_id` = ? WHERE `id` = ?', [invoiceNumber, job.id])
        return {
          success: true,
          posted: true,
          invoiceId: invoiceNumber,
          payable: customerPayable,
          message: `Linked existing invoice "${invoiceNumber}".`
        }
      }

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) // Net 14 days payment terms

      await conn.query(`
        INSERT INTO \`invoices\` (
          \`id\`, \`invoice_number\`, \`order_id\`, \`order_number\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`subtotal\`, \`discount\`, \`tax\`, \`total\`, \`paid_amount\`, \`outstanding_amount\`,
          \`status\`, \`status_class\`, \`issued_date\`, \`due_date\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, ?, ?)
      `, [
        invoiceId,
        invoiceNumber,
        job.id,
        job.job_number || job.id,
        job.customer_id,
        job.customer_name,
        job.branch_id,
        job.branch,
        totalCost,
        warrantyCoverage,
        0.00,
        customerPayable,
        0.00,
        customerPayable,
        'Unpaid',
        'bg-[#fef3c7] text-[#b45309]',
        dueDate.toISOString().split('T')[0],
        `Commercial Workshop Repair Invoice for Job ${job.id} (Unit: ${job.unit_serial || job.unit_id || 'EV'})`
      ])

      // 5. Insert invoice line items
      const [jobItems] = await conn.query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ?', [job.id])
      for (const itm of jobItems) {
        await conn.query(`
          INSERT INTO \`invoice_items\` (
            \`invoice_id\`, \`product_id\`, \`description\`, \`quantity\`, \`unit_price\`, \`subtotal\`
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          invoiceId,
          itm.product_id || null,
          `${itm.item_type === 'part' ? 'Part' : 'Labour'}: ${itm.item_name}`,
          parseInt(itm.quantity || 1, 10),
          parseFloat(itm.unit_price || 0),
          parseFloat(itm.subtotal || 0)
        ])
      }

      // 6. Update repair job record
      await conn.query('UPDATE `repair_jobs` SET `posted_to_finance` = 1, `invoice_id` = ? WHERE `id` = ?', [
        invoiceNumber, job.id
      ])

      return {
        success: true,
        posted: true,
        warrantyCovered: false,
        invoiceId: invoiceNumber,
        payable: customerPayable,
        message: `Repair job "${job.id}" posted to Finance as Invoice "${invoiceNumber}" (Payable: PKR ${customerPayable.toLocaleString()}).`
      }
    })
  },

  // ==========================================================================
  // 3. WARRANTY CLAIMS
  // ==========================================================================

  async findWarrantyClaims({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `warranty_claims` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, getBranchName(branch_id))
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      sql += ' AND (`claim_number` LIKE ? OR `customer_name` LIKE ? OR `vin` LIKE ? OR `coverage_policy` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatWarrantyClaimRow)
  },

  async findWarrantyClaimById(id) {
    if (!id) return null
    const rows = await query('SELECT * FROM `warranty_claims` WHERE `id` = ? OR `claim_number` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null
    return formatWarrantyClaimRow(rows[0])
  },

  async createWarrantyClaim(data, user) {
    const branchId = resolveBranchId(data.branch_id || data.branch || user?.branch_id || 'BR-01')
    const branchName = getBranchName(branchId)

    let claimId = data.id || data.claimNumber
    if (!claimId) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `CLM-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await query('SELECT `id` FROM `warranty_claims` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          claimId = candidate
          break
        }
        attempts++
      }
      if (!claimId) claimId = `CLM-${Date.now().toString().slice(-6)}`
    }
    const claimNumber = data.claim_number || claimId
    const claimAmount = parseFloat(data.claimAmount || data.rawClaimAmount || data.amount || 0)

    const claimDate = data.claimDate || new Date().toISOString().split('T')[0]

    await query(`
      INSERT INTO \`warranty_claims\` (
        \`id\`, \`claim_number\`, \`case_id\`, \`repair_job_id\`, \`branch_id\`, \`branch\`,
        \`unit_id\`, \`vin\`, \`customer_id\`, \`customer_name\`, \`claim_date\`, \`claim_amount\`,
        \`coverage_policy\`, \`status\`, \`decision\`, \`authorized_by\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)
    `, [
      claimId,
      claimNumber,
      data.case_id || data.caseId || null,
      data.repair_job_id || data.repairJobId || null,
      branchId,
      branchName,
      data.unit_id || null,
      data.vin || null,
      data.customer_id || 'CUST-101',
      data.customer_name || data.customer || 'Customer',
      claimDate,
      claimAmount,
      data.coveragePolicy || 'Full System 2-Year OEM Warranty',
      data.decision || 'Submitted for OEM evaluation',
      data.authorized_by || null,
      data.notes || null
    ])

    return await this.findWarrantyClaimById(claimId)
  },

  async approveWarrantyClaim(id, user) {
    const existing = await this.findWarrantyClaimById(id)
    if (!existing) {
      const err = new Error(`Warranty claim with ID "${id}" was not found.`)
      err.status = 404
      throw err
    }

    if (existing.status === 'Approved') {
      const err = new Error(`Warranty claim "${id}" is already approved.`)
      err.status = 409
      throw err
    }

    const approverName = user?.name || 'Authorized Lead'
    await query(`
      UPDATE \`warranty_claims\`
      SET \`status\` = 'Approved',
          \`decision\` = 'OEM Warranty Coverage Approved',
          \`authorized_by\` = ?
      WHERE \`id\` = ? OR \`claim_number\` = ?
    `, [approverName, id, id])

    return await this.findWarrantyClaimById(id)
  },

  async rejectWarrantyClaim(id, reason, user) {
    const existing = await this.findWarrantyClaimById(id)
    if (!existing) {
      const err = new Error(`Warranty claim with ID "${id}" was not found.`)
      err.status = 404
      throw err
    }

    const approverName = user?.name || 'Authorized Lead'
    await query(`
      UPDATE \`warranty_claims\`
      SET \`status\` = 'Rejected',
          \`decision\` = 'OEM Warranty Coverage Denied',
          \`rejection_reason\` = ?,
          \`authorized_by\` = ?
      WHERE \`id\` = ? OR \`claim_number\` = ?
    `, [reason || 'Warranty claim conditions not met.', approverName, id, id])

    return await this.findWarrantyClaimById(id)
  },

  // ==========================================================================
  // 4. OVERVIEW & KPIS
  // ==========================================================================

  async getOverview(user) {
    const branchId = resolveBranchId(user?.branch_id)
    const isGlobal = !branchId || branchId === 'ALL' || user?.isSuperAdmin || user?.role === 'Super Admin'

    let caseBranchClause = ''
    let repairBranchClause = ''
    const params = []

    if (!isGlobal) {
      caseBranchClause = ' WHERE `branch_id` = ? OR `branch` = ?'
      repairBranchClause = ' WHERE `branch_id` = ? OR `branch` = ?'
      params.push(branchId, getBranchName(branchId))
    }

    const [caseCounts] = await query(`
      SELECT
        COUNT(*) as total_cases,
        SUM(CASE WHEN \`status\` NOT IN ('Resolved', 'Cancelled', 'Closed') THEN 1 ELSE 0 END) as open_cases,
        SUM(CASE WHEN \`priority\` = 'High' AND \`status\` NOT IN ('Resolved', 'Cancelled', 'Closed') THEN 1 ELSE 0 END) as high_priority_cases,
        SUM(CASE WHEN \`warranty_status\` = 'Active' THEN 1 ELSE 0 END) as warranty_cases,
        SUM(CASE WHEN \`warranty_status\` != 'Active' THEN 1 ELSE 0 END) as out_of_warranty_cases
      FROM \`service_cases\`
      ${caseBranchClause}
    `, params)

    const [repairCounts] = await query(`
      SELECT
        COUNT(*) as total_repairs,
        SUM(CASE WHEN \`status\` NOT IN ('Completed', 'Cancelled') THEN 1 ELSE 0 END) as open_repairs,
        SUM(CASE WHEN \`status\` = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN \`status\` IN ('Waiting for Parts', 'Awaiting Parts', 'Parts Waiting') THEN 1 ELSE 0 END) as awaiting_parts,
        SUM(CASE WHEN \`status\` = 'Ready' THEN 1 ELSE 0 END) as ready_for_customer,
        SUM(CASE WHEN \`status\` = 'Completed' THEN 1 ELSE 0 END) as completed_repairs
      FROM \`repair_jobs\`
      ${repairBranchClause}
    `, params)

    // Branch Workload distribution across all branches (for Super Admin dashboard)
    const branchWorkloadRows = await query(`
      SELECT
        \`branch\`,
        COUNT(*) as count
      FROM \`repair_jobs\`
      WHERE \`status\` NOT IN ('Completed', 'Cancelled')
      GROUP BY \`branch\`
    `)

    const branchesList = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
    const workloadCounts = branchesList.map(b => {
      const match = branchWorkloadRows.find(r => (r.branch || '').toLowerCase() === b.toLowerCase())
      return { name: b, value: match ? parseInt(match.count, 10) : 0 }
    })
    const maxVal = Math.max(...workloadCounts.map(w => w.value), 1)
    const branchWorkload = workloadCounts.map(w => ({
      name: w.name,
      value: w.value,
      percentage: w.value > 0 ? Math.round((w.value / maxVal) * 100) : 0
    }))

    // Recent cases and repairs
    const recentCases = await this.findCases({ branch_id: isGlobal ? 'ALL' : branchId, limit: 5 })
    const recentRepairs = await this.findRepairJobs({ branch_id: isGlobal ? 'ALL' : branchId, limit: 5 })

    return {
      kpis: {
        openCases: parseInt(caseCounts?.open_cases || 0, 10),
        highPriorityCases: parseInt(caseCounts?.high_priority_cases || 0, 10),
        warrantyCases: parseInt(caseCounts?.warranty_cases || 0, 10),
        outOfWarrantyCases: parseInt(caseCounts?.out_of_warranty_cases || 0, 10),
        openRepairs: parseInt(repairCounts?.open_repairs || 0, 10),
        inProgressRepairs: parseInt(repairCounts?.in_progress || 0, 10),
        awaitingPartsRepairs: parseInt(repairCounts?.awaiting_parts || 0, 10),
        readyForCustomer: parseInt(repairCounts?.ready_for_customer || 0, 10),
        completedRepairs: parseInt(repairCounts?.completed_repairs || 0, 10)
      },
      branchWorkload,
      recentCases,
      recentRepairs
    }
  }
}
