import { store } from '../src/store.js'

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`✅ PASSED: ${message}`)
}

console.log('\n--- STARTING PROMPT 6: MARKETING, COMMUNICATIONS, NOTIFICATIONS & INBOX VERIFICATION ---\n')

// 1. Initial State & Deduplication Check
console.log('--- 1. NOTIFICATIONS INITIAL STATE & DEDUPLICATION ---')
const initialNotifCount = store.notifications.length
assert(initialNotifCount > 0, `Store initialized with ${initialNotifCount} notifications`)

// Try adding duplicate notification with same dedupe key
const initialDedupeKeysSize = store._notificationDedupeKeys.size
const duplicateNotif = store.addNotification({
  title: 'Low Stock Alert',
  message: 'Duplicate test',
  source_type: 'inventory',
  source_id: 'BRG-E125',
  event_type: 'LOW_STOCK',
  recipient: 'BR-01'
})
assert(store.notifications.length === initialNotifCount, 'Deterministic deduplication prevented duplicate notification insertion')

// Add a genuinely new operational notification
const newNotif = store.addNotification({
  title: 'Custom Test Alert',
  message: 'A brand new test notification for Peshawar',
  source_type: 'order',
  source_id: 'ORD-TEST-999',
  event_type: 'CREATED',
  branch: 'Peshawar',
  branch_id: 'BR-01',
  recipient_role: 'Branch Manager',
  category: 'Sales'
})
assert(store.notifications.length === initialNotifCount + 1, 'New distinct notification successfully added')
assert(newNotif.status === 'Unread' && newNotif.read === 'No' && newNotif.isRead === false, 'New notification has correct unread status flags')
assert(newNotif.link.includes('ORD-TEST-999'), `Notification generated correct operational link: ${newNotif.link}`)

// 2. Read / Unread Status Mutation
console.log('\n--- 2. READ / UNREAD STATUS MUTATION ---')
store.markNotificationRead(newNotif.id)
assert(newNotif.status === 'Read' && newNotif.read === 'Yes' && newNotif.isRead === true, 'markNotificationRead successfully set status to Read')
assert(newNotif.read_at !== null, 'markNotificationRead recorded read_at timestamp')

store.markNotificationUnread(newNotif.id)
assert(newNotif.status === 'Unread' && newNotif.read === 'No' && newNotif.isRead === false, 'markNotificationUnread restored unread state')

// 3. Branch & Role Scoping
console.log('\n--- 3. BRANCH & ROLE SCOPING ---')
const peshawarUser = { id: 'USR-03', role: 'Branch Manager', branchName: 'Peshawar', branch_id: 'BR-01', isSuperAdmin: false }
const islamabadUser = { id: 'USR-04', role: 'Branch Manager', branchName: 'Islamabad', branch_id: 'BR-02', isSuperAdmin: false }
const superAdminUser = { id: 'USR-01', role: 'Super Admin', branchName: 'All Branches', isSuperAdmin: true }

// Create an Islamabad-specific notification
const isbNotif = store.addNotification({
  title: 'Islamabad Alert',
  message: 'Islamabad branch notification test',
  source_type: 'stock_req',
  source_id: 'SR-ISB-001',
  event_type: 'DISPATCH',
  branch: 'Islamabad',
  branch_id: 'BR-02',
  recipient_role: 'Branch Manager'
})

const peshawarNotifs = store.getNotificationsForUser(peshawarUser)
const islamabadNotifs = store.getNotificationsForUser(islamabadUser)
const saNotifs = store.getNotificationsForUser(superAdminUser)

assert(peshawarNotifs.some(n => n.id === newNotif.id), 'Peshawar BM sees Peshawar notification')
assert(!peshawarNotifs.some(n => n.id === isbNotif.id), 'Peshawar BM CANNOT see Islamabad notification (strict branch boundary)')
assert(islamabadNotifs.some(n => n.id === isbNotif.id), 'Islamabad BM sees Islamabad notification')
assert(saNotifs.some(n => n.id === newNotif.id) && saNotifs.some(n => n.id === isbNotif.id), 'Super Admin has cross-branch visibility')

// Test markAllNotificationsRead for Peshawar user
const peshawarUnreadBefore = store.getUnreadNotificationCount(peshawarUser)
store.markAllNotificationsRead(peshawarUser)
const peshawarUnreadAfter = store.getUnreadNotificationCount(peshawarUser)
assert(peshawarUnreadAfter === 0, `Peshawar user markAllNotificationsRead reduced unread count from ${peshawarUnreadBefore} to 0`)

// 4. Operational Event Triggers
console.log('\n--- 4. OPERATIONAL EVENT TRIGGER TESTING ---')
const notifCountBeforeTriggers = store.notifications.length

// Trigger 4A: Stock Request Creation
const sr = store.addStockRequest({
  item: 'BRG E-125 Eco Scooter',
  sku: 'BRG-E125-BLK',
  qty: 2,
  priority: 'High',
  reason: 'Urgent customer booking'
})
assert(store.notifications.some(n => n.source_type === 'stock_request' && n.source_id === sr.id), `Stock request ${sr.id} automatically emitted notification`)

// Trigger 4B: Stock Request Approval
store.approveStockRequest(sr.id, 'Super Admin')
assert(store.notifications.some(n => n.source_type === 'stock_request' && n.title.includes('Approved')), `Stock request ${sr.id} approval emitted notification`)

// Trigger 4C: Quotation Creation
const quote = store.addQuotation({
  customerName: 'Prompt 6 Test Customer',
  customerPhone: '0300-1234567',
  model: 'BRG DS11 Electric',
  variant: 'Standard',
  price: 265000,
  qty: 1
})
assert(store.notifications.some(n => n.source_type === 'quotation' && n.source_id === quote.id), `Quotation ${quote.id} automatically emitted notification`)

// Trigger 4D: Sales Order Creation
const order = store.addOrder({
  customerName: 'Prompt 6 Test Customer',
  customerPhone: '0300-1234567',
  unitModel: 'BRG DS11 Electric',
  unitColor: 'Midnight Blue',
  unitPrice: 265000,
  downPayment: 65000,
  quotationId: quote.id
})
assert(store.notifications.some(n => (n.source_type === 'sales_order' || n.source_type === 'order') && n.source_id === order.id), `Sales order ${order.id} automatically emitted notification`)

// Trigger 4E: Invoice Payment
const inv = store.invoices.find(i => (i.outstandingAmount || 0) > 0) || store.invoices[0]
if (inv) {
  store.recordInvoicePayment({ invoiceId: inv.id, amount: 5000, method: 'Cash', notes: 'Settlement test' })
  assert(store.notifications.some(n => n.source_type === 'payment' && n.source_id === inv.id), `Invoice payment for ${inv.id} automatically emitted notification`)
}

// Trigger 4F: After-Sales Service Case
const serviceCase = store.addCase({
  customerName: 'Prompt 6 Test Customer',
  phone: '0300-1234567',
  vehicleModel: 'BRG DS11 Electric',
  vin: 'VIN-P6-999',
  plateNumber: 'P-999',
  type: 'Throttle / Controller Issue',
  priority: 'High',
  description: 'Erratic throttle acceleration'
})
assert(store.notifications.some(n => n.source_type === 'service_case' && n.source_id === serviceCase.id), `Service case ${serviceCase.id} automatically emitted notification`)

// 5. Follow-ups Lifecycle
console.log('\n--- 5. FOLLOW-UPS LIFECYCLE ---')
const initialFollowUpsCount = store.followUps.length
const newFollowUp = store.addFollowUp({
  customer: 'Prompt 6 Follow-up Customer',
  linkedRecord: order.id,
  type: 'Payment Reminder',
  taskType: 'Payment Reminder',
  owner: 'Hamza Ali',
  branch: 'Peshawar',
  due: 'Today 16:00',
  dueDate: 'Today',
  dueTime: '16:00',
  priority: 'High'
})
assert(store.followUps.length === initialFollowUpsCount + 1, 'addFollowUp successfully registered new follow-up')
assert(newFollowUp.status === 'Due Today', 'New follow-up defaults to Due Today')

store.completeFollowUp(newFollowUp.id)
assert(newFollowUp.status === 'Completed', 'completeFollowUp successfully marked task as Completed')
assert(newFollowUp.completedAt !== undefined, 'completedAt timestamp recorded')

// 6. Management Inbox & Conversations
console.log('\n--- 6. MANAGEMENT INBOX & CONVERSATIONS ---')
const initialConvCount = store.conversations.length
const createdConv = store.addConversation({
  title: 'Urgent Allocation Discussion',
  linked: sr.id,
  linkedType: 'Stock Request',
  branch: 'Peshawar',
  recipient: 'Super Admin',
  priority: 'High',
  message: 'Please review stock request allocation priority.'
})
assert(store.conversations.length === initialConvCount + 1, 'addConversation successfully registered new thread')
assert(createdConv.linked === sr.id, `Conversation linked to operational record ${sr.id}`)

// Retrieve conversation
const fetched = store.getConversationById(createdConv.id)
assert(fetched !== null && fetched.id === createdConv.id, `getConversationById resolved ${createdConv.id}`)

// Add message to conversation
const msg = store.addMessageToConversation(createdConv.id, {
  sender: 'Super Admin',
  text: 'Allocated from Central Warehouse batch 4.'
})
assert(fetched.messages.length === 2, 'Message successfully appended to conversation')
assert(fetched.lastMsg === 'Allocated from Central Warehouse batch 4.', 'Conversation lastMsg preview updated')

// Validate whitespace / empty message rejection
let caughtError = false
try {
  store.addMessageToConversation(createdConv.id, {
    sender: 'Branch Manager',
    text: '   '
  })
} catch (e) {
  caughtError = true
}
assert(caughtError, 'addMessageToConversation strictly rejected empty/whitespace-only message')

// Mark conversation read
store.markConversationRead(createdConv.id)
assert(createdConv.unread === 0, 'markConversationRead reset unread count to 0')

// 7. Announcements
console.log('\n--- 7. ANNOUNCEMENTS MASTER ---')
const initialAnnounceCount = store.announcements.length
const ann = store.createAnnouncement({
  title: 'Peshawar Showroom Inventory Audit',
  message: 'Mandatory quarterly audit on Friday.',
  targetRoles: ['Branch Manager'],
  targetBranches: ['Peshawar'],
  priority: 'High'
})
assert(store.announcements.length === initialAnnounceCount + 1, 'createAnnouncement added announcement')
assert(store.notifications.some(n => n.source_type === 'announcement' && n.source_id === ann.id), 'Announcement auto-emitted targeted notifications')

console.log('\n======================================================')
console.log('🎉 ALL PROMPT 6 SUITE INTEGRATION TESTS PASSED!')
console.log('======================================================\n')
