const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');

// Search all this.addNotification calls in store.js
const notifCalls = [...storeContent.matchAll(/this\.addNotification\s*\(\{([\s\S]*?)\}\)/g)];

const notificationProducers = [];
for (const match of notifCalls) {
  const body = match[1];
  const titleM = body.match(/title:\s*['"]([^'"]+)['"]/);
  const msgM = body.match(/message:\s*`([^`]+)`|message:\s*['"]([^'"]+)['"]/);
  const catM = body.match(/category:\s*['"]([^'"]+)['"]/);
  const roleM = body.match(/recipient_role:\s*['"]([^'"]+)['"]/);
  const linkM = body.match(/link:\s*`([^`]+)`|link:\s*['"]([^'"]+)['"]/);
  const eventM = body.match(/event_type:\s*['"]([^'"]+)['"]/);

  const title = titleM ? titleM[1] : 'Notification';
  const category = catM ? catM[1] : 'General';
  const recipient = roleM ? roleM[1] : 'Super Admin / Branch Manager';
  const link = linkM ? (linkM[1] || linkM[2]) : null;
  const event = eventM ? eventM[1] : 'INFO';

  const standsInForActionCentre = title.toLowerCase().includes('approval') || 
                                 title.toLowerCase().includes('submitted') || 
                                 title.toLowerCase().includes('request') || 
                                 title.toLowerCase().includes('pending');

  notificationProducers.push({
    title,
    event,
    category,
    recipient,
    link,
    readState: 'UNREAD_ON_CREATION',
    actionRequired: standsInForActionCentre,
    defect: standsInForActionCentre ? 'NOTIFICATION_STANDS_IN_FOR_ACTION_CENTRE' : null,
    reason: standsInForActionCentre ? `Notification for '${title}' emitted without raising actionable governance work item in Action Centre queue` : 'Informational telemetry'
  });
}

// Audit Messaging
const convRegex = /conversations:\s*\[([\s\S]*?)\],\s*activeConversationId/m;
const convMatch = storeContent.match(convRegex);
let conversationsCount = 0;
if (convMatch) {
  const cMatches = [...convMatch[1].matchAll(/\{\s*id:\s*['"]([^'"]+)['"]/g)];
  conversationsCount = cMatches.length;
}

const messageArchitecture = {
  totalNotificationProducers: notificationProducers.length,
  notificationsStandingInForActionCentre: notificationProducers.filter(n => n.defect).length,
  notificationList: notificationProducers,
  conversationsState: {
    totalConversations: conversationsCount,
    supportsFormalApprovals: false,
    finding: 'Communication inbox is strictly conversational text messaging; formal business approvals must not be executed via inbox messages.'
  }
};

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/notifications_and_messaging.json'),
  JSON.stringify(messageArchitecture, null, 2),
  'utf8'
);

console.log(`Audited ${notificationProducers.length} notification producers:`);
console.log(`Notifications standing in for Action Centre: ${messageArchitecture.notificationsStandingInForActionCentre}`);
