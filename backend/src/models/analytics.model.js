import { query } from '../config/db.js'

export function formatCustomReportRow(row) {
  if (!row) return null
  let metrics = null
  try {
    metrics = row.metrics ? JSON.parse(row.metrics) : null
  } catch {
    metrics = row.metrics
  }

  return {
    id: row.id,
    name: row.name,
    report: row.report || row.name,
    category: row.category,
    scope: row.scope,
    dateRange: row.date_range,
    date_range: row.date_range,
    comparison: row.comparison,
    status: row.status,
    schedule: row.schedule,
    format: row.format,
    email: row.email,
    metrics: metrics,
    owner: row.owner || 'Super Admin',
    lastRun: row.last_run || 'Just now',
    last_run: row.last_run || 'Just now',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const CustomReportModel = {
  async findAll({ category, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `custom_reports` WHERE 1=1'
    const params = []

    if (category && category !== 'All') {
      sql += ' AND `category` = ?'
      params.push(category)
    }

    if (search && search.trim() !== '') {
      sql += ' AND (`name` LIKE ? OR `report` LIKE ? OR `category` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatCustomReportRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `custom_reports` WHERE `id` = ? OR `name` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatCustomReportRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `REP-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `custom_reports` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `REP-${Date.now().toString().slice(-6)}`
    }
    const name = data.name || data.report || 'Custom Report'
    const report = data.report || name
    const category = data.category || 'Sales Reports'
    const scope = data.scope || 'All Branches'
    const dateRange = data.dateRange || data.date_range || 'This Month'
    const comparison = data.comparison || 'Previous Period'
    const status = data.status || 'All Active'
    const schedule = data.schedule || 'Monthly'
    const format = data.format || 'PDF Summary'
    const email = data.email || null
    const metrics = typeof data.metrics === 'object' ? JSON.stringify(data.metrics) : (data.metrics || null)
    const owner = data.owner || 'Super Admin'
    const lastRun = data.lastRun || data.last_run || 'Just now'

    await query(`
      INSERT INTO \`custom_reports\` (
        \`id\`, \`name\`, \`report\`, \`category\`, \`scope\`,
        \`date_range\`, \`comparison\`, \`status\`, \`schedule\`,
        \`format\`, \`email\`, \`metrics\`, \`owner\`, \`last_run\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`name\` = VALUES(\`name\`),
        \`report\` = VALUES(\`report\`),
        \`category\` = VALUES(\`category\`),
        \`scope\` = VALUES(\`scope\`),
        \`date_range\` = VALUES(\`date_range\`),
        \`comparison\` = VALUES(\`comparison\`),
        \`status\` = VALUES(\`status\`),
        \`schedule\` = VALUES(\`schedule\`),
        \`format\` = VALUES(\`format\`),
        \`email\` = VALUES(\`email\`),
        \`metrics\` = VALUES(\`metrics\`),
        \`owner\` = VALUES(\`owner\`),
        \`last_run\` = VALUES(\`last_run\`)
    `, [
      id, name, report, category, scope,
      dateRange, comparison, status, schedule,
      format, email, metrics, owner, lastRun
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = data.name || data.report || existing.name
    const report = data.report || name
    const category = data.category !== undefined ? data.category : existing.category
    const scope = data.scope !== undefined ? data.scope : existing.scope
    const dateRange = data.dateRange || data.date_range || existing.dateRange
    const comparison = data.comparison !== undefined ? data.comparison : existing.comparison
    const status = data.status !== undefined ? data.status : existing.status
    const schedule = data.schedule !== undefined ? data.schedule : existing.schedule
    const format = data.format !== undefined ? data.format : existing.format
    const email = data.email !== undefined ? data.email : existing.email
    const metrics = data.metrics !== undefined ? (typeof data.metrics === 'object' ? JSON.stringify(data.metrics) : data.metrics) : (typeof existing.metrics === 'object' ? JSON.stringify(existing.metrics) : existing.metrics)
    const lastRun = data.lastRun || data.last_run || existing.lastRun

    await query(`
      UPDATE \`custom_reports\` SET
        \`name\` = ?,
        \`report\` = ?,
        \`category\` = ?,
        \`scope\` = ?,
        \`date_range\` = ?,
        \`comparison\` = ?,
        \`status\` = ?,
        \`schedule\` = ?,
        \`format\` = ?,
        \`email\` = ?,
        \`metrics\` = ?,
        \`last_run\` = ?
      WHERE \`id\` = ?
    `, [
      name, report, category, scope, dateRange,
      comparison, status, schedule, format, email,
      metrics, lastRun, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`custom_reports\` WHERE \`id\` = ?', [id])
    return true
  }
}
