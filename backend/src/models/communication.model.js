import { query } from '../config/db.js'

export function formatConversationRow(row, messages = []) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || `Conversation — ${row.title}`,
    thread: row.thread || row.title,
    subject: row.subject || row.title,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    linked: row.linked || 'General',
    linkedType: row.linked_type || 'Stock Request',
    linked_type: row.linked_type || 'Stock Request',
    from: row.from_user || 'Branch Manager',
    from_user: row.from_user || 'Branch Manager',
    recipient: row.recipient || 'Super Admin',
    lastMsg: row.last_msg || 'New message',
    last_msg: row.last_msg || 'New message',
    priority: row.priority || 'Medium',
    priorityClass: row.priority_class || 'bg-blue-50 text-blue-700',
    priority_class: row.priority_class || 'bg-blue-50 text-blue-700',
    unread: Number(row.unread || 0),
    status: row.status || 'Open',
    statusClass: row.status_class || 'bg-[#dcfce7] text-[#15803d]',
    status_class: row.status_class || 'bg-[#dcfce7] text-[#15803d]',
    participants: row.participants || 'Super Admin, Branch Manager',
    lastReply: row.last_reply || 'Just now',
    last_reply: row.last_reply || 'Just now',
    owner: row.owner || 'Super Admin',
    replies: Number(row.replies || (messages.length > 0 ? messages.length : 1)),
    message: row.last_msg || row.title,
    messages: messages.map(m => ({
      id: m.id,
      sender: m.sender,
      role: m.role || '',
      branch: m.branch || '',
      text: m.text,
      attachment: m.attachment || null,
      time: m.time || (m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'),
      createdAt: m.created_at
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const ConversationModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `conversations` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ? OR `branch` = "All Branches")'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      sql += ' AND (`title` LIKE ? OR `subject` LIKE ? OR `recipient` LIKE ? OR `linked` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `updated_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    const result = []
    for (const row of rows) {
      const msgs = await query('SELECT * FROM `conversation_messages` WHERE `conversation_id` = ? ORDER BY `id` ASC', [row.id])
      result.push(formatConversationRow(row, msgs))
    }
    return result
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `conversations` WHERE `id` = ? LIMIT 1', [id])
    if (rows.length === 0) return null
    const msgs = await query('SELECT * FROM `conversation_messages` WHERE `conversation_id` = ? ORDER BY `id` ASC', [id])
    return formatConversationRow(rows[0], msgs)
  },

  async create(data) {
    let id = data.id
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `CONV-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `conversations` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `CONV-${Date.now().toString().slice(-6)}`
    }
    const title = data.title || data.subject || 'New Conversation'
    const subtitle = data.subtitle || `Conversation — ${title}`
    const thread = data.thread || title
    const subject = data.subject || title
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'
    const linked = data.linked || 'General'
    const linkedType = data.linkedType || data.linked_type || 'Stock Request'
    const fromUser = data.from || data.from_user || 'Branch Manager'
    const recipient = data.recipient || 'Super Admin'
    const lastMsg = data.message || data.lastMsg || data.last_msg || title
    const priority = data.priority || 'Medium'
    const priorityClass = data.priorityClass || data.priority_class || (priority === 'High' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-blue-50 text-blue-700')
    const unread = Number(data.unread || 0)
    const status = data.status || 'Open'
    const statusClass = data.statusClass || data.status_class || 'bg-[#dcfce7] text-[#15803d]'
    const participants = data.participants || `${fromUser}, ${recipient}`
    const lastReply = data.lastReply || data.last_reply || 'Just now'
    const owner = data.owner || fromUser
    const replies = 1

    await query(`
      INSERT INTO \`conversations\` (
        \`id\`, \`title\`, \`subtitle\`, \`thread\`, \`subject\`,
        \`branch_id\`, \`branch\`, \`linked\`, \`linked_type\`,
        \`from_user\`, \`recipient\`, \`last_msg\`, \`priority\`,
        \`priority_class\`, \`unread\`, \`status\`, \`status_class\`,
        \`participants\`, \`last_reply\`, \`owner\`, \`replies\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`subtitle\` = VALUES(\`subtitle\`),
        \`thread\` = VALUES(\`thread\`),
        \`last_msg\` = VALUES(\`last_msg\`),
        \`priority\` = VALUES(\`priority\`),
        \`priority_class\` = VALUES(\`priority_class\`),
        \`status\` = VALUES(\`status\`),
        \`status_class\` = VALUES(\`status_class\`),
        \`last_reply\` = VALUES(\`last_reply\`)
    `, [
      id, title, subtitle, thread, subject,
      branchId, branch, linked, linkedType,
      fromUser, recipient, lastMsg, priority,
      priorityClass, unread, status, statusClass,
      participants, lastReply, owner, replies
    ])

    // If initial message provided, insert into conversation_messages
    const initialText = data.message || data.lastMsg || title
    await query(`
      INSERT INTO \`conversation_messages\` (
        \`conversation_id\`, \`sender\`, \`role\`, \`branch\`, \`text\`, \`attachment\`, \`time\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id, fromUser, branch, branch, initialText, data.attachment || null, 'Just now'
    ])

    return this.findById(id)
  },

  async addMessage(conversationId, data) {
    const conv = await this.findById(conversationId)
    if (!conv) return null

    const sender = data.sender || 'Staff'
    const role = data.role || ''
    const branch = data.branch || conv.branch || 'Peshawar'
    const text = data.text || data.message || ''
    const attachment = data.attachment || null
    const time = data.time || 'Just now'

    await query(`
      INSERT INTO \`conversation_messages\` (
        \`conversation_id\`, \`sender\`, \`role\`, \`branch\`, \`text\`, \`attachment\`, \`time\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      conversationId, sender, role, branch, text, attachment, time
    ])

    await query(`
      UPDATE \`conversations\` SET
        \`last_msg\` = ?,
        \`last_reply\` = ?,
        \`replies\` = \`replies\` + 1
      WHERE \`id\` = ?
    `, [
      text, time, conversationId
    ])

    return this.findById(conversationId)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const title = data.title !== undefined ? data.title : existing.title
    const priority = data.priority !== undefined ? data.priority : existing.priority
    const priorityClass = data.priorityClass || data.priority_class || existing.priorityClass
    const status = data.status !== undefined ? data.status : existing.status
    const statusClass = data.statusClass || data.status_class || existing.statusClass
    const lastMsg = data.lastMsg || data.last_msg || existing.lastMsg

    await query(`
      UPDATE \`conversations\` SET
        \`title\` = ?,
        \`priority\` = ?,
        \`priority_class\` = ?,
        \`status\` = ?,
        \`status_class\` = ?,
        \`last_msg\` = ?
      WHERE \`id\` = ?
    `, [
      title, priority, priorityClass, status, statusClass, lastMsg, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`conversations\` WHERE \`id\` = ?', [id])
    return true
  }
}
