import fs from 'fs'
import path from 'path'
import { store } from '../src/store.js'

console.log('=================================================================')
console.log('AJ ECODRIVE — PRE-AUDIT DIAGNOSTIC INSPECTOR')
console.log('=================================================================\n')

// 1. Check Store Keys
console.log('--- 1. Store Master State Keys ---')
const keys = Object.keys(store)
console.log('Total store keys:', keys.length)
const expectedEntities = [
  'users', 'branches', 'suppliers', 'products', 'categories', 
  'serializedUnits', 'customers', 'leads', 'quotations', 'orders', 
  'invoices', 'payments', 'deliveries', 'ownerships', 'warranties', 
  'cases', 'repairs', 'expenses', 'purchaseOrders', 'receipts', 
  'transfers', 'stockRequests', 'stockAdjustments', 'notifications', 
  'conversations', 'auditLogs', 'settings'
]
expectedEntities.forEach(ent => {
  const exists = typeof store[ent] !== 'undefined'
  const isArr = Array.isArray(store[ent])
  const count = isArr ? store[ent].length : (exists ? typeof store[ent] : 'MISSING')
  console.log(`Entity [${ent}]: exists=${exists}, count/type=${count}`)
})

// 2. Search for local "mock" or "dummy" arrays in views
console.log('\n--- 2. Scanning Views for Competing/Local Mock Datasets ---')
const findVueFiles = (dir) => {
  let files = []
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(findVueFiles(full))
    } else if (entry.name.endsWith('.vue')) {
      files.push(full)
    }
  })
  return files
}

const vueFiles = findVueFiles('./src/views')
console.log(`Found ${vueFiles.length} Vue views in src/views`)

const suspiciousPatterns = [
  { name: 'mockCustomers', regex: /mockCustomers\s*=\s*\[/i },
  { name: 'mockProducts', regex: /mockProducts\s*=\s*\[/i },
  { name: 'mockOrders', regex: /mockOrders\s*=\s*\[/i },
  { name: 'mockInvoices', regex: /mockInvoices\s*=\s*\[/i },
  { name: 'mockUsers', regex: /mockUsers\s*=\s*\[/i },
  { name: 'localCustomers', regex: /localCustomers\s*=\s*\[/i }
]

let suspiciousFound = 0
vueFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  suspiciousPatterns.forEach(p => {
    if (p.regex.test(content)) {
      console.log(`[ALERT] Suspicious pattern ${p.name} in: ${file}`)
      suspiciousFound++
    }
  })
})
if (suspiciousFound === 0) {
  console.log('✅ No competing mock customer/product/order/user arrays found in views.')
}

// 3. Inspect System/Settings Views
console.log('\n--- 3. System Views Inspection ---')
const systemViews = [
  './src/views/system/Settings.vue',
  './src/views/system/Account.vue',
  './src/views/system/Preferences.vue',
  './src/views/system/SecuritySessions.vue',
  './src/views/system/BranchTeam.vue'
]
systemViews.forEach(v => {
  if (fs.existsSync(v)) {
    const c = fs.readFileSync(v, 'utf8')
    const usesStore = c.includes("from '@/store") || c.includes("from '../../store")
    console.log(`View ${v}: exists=true, usesStore=${usesStore}`)
  } else {
    console.log(`View ${v}: MISSING!`)
  }
})

console.log('\nDiagnostic scan complete.')
