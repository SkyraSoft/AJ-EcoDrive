<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ChevronRight, CornerDownLeft, Sliders, Shield, Users, Building2, Bell, FileText, Database, Key } from 'lucide-vue-next'
import { store } from '@/store.js'

const props = defineProps({
  tourId: {
    type: String,
    default: 'shared.header.settings-search'
  }
})

const router = useRouter()
const route = useRoute()

const query = ref('')
const isOpen = ref(false)
const selectedIndex = ref(-1)
const rootRef = ref(null)
const inputRef = ref(null)

// Current authenticated user role
const currentUserRole = computed(() => {
  return store?.currentUser?.role || (store?.isBranchUser?.() ? 'Branch Manager' : 'Super Admin')
})

const isSuperAdmin = computed(() => {
  return currentUserRole.value === 'Super Admin' || (!store?.isBranchUser?.() && !store?.currentUser?.branchId)
})

/**
 * Authoritative Canonical Settings Search Index
 * Strictly maps to real routes, pages, and tabs existing in AJ EcoDrive.
 */
const SETTINGS_INDEX = [
  // --- ORGANISATION ---
  {
    id: 'org-users',
    title: 'Users & Access',
    breadcrumb: 'Organisation → Users & Access',
    description: 'Manage user accounts, credentials, role assignments, and branch access.',
    route: '/organisation/users',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['users', 'user', 'access', 'branch user', 'staff', 'employees', 'accounts', 'user management', 'branch assignment', 'assign branch', 'user list', 'credentials', 'reset password']
  },
  {
    id: 'org-roles',
    title: 'Roles & Permissions',
    breadcrumb: 'Organisation → Roles & Permissions',
    description: 'Role-based access control, privilege definitions, and granular permission matrices.',
    route: '/organisation/roles',
    tab: null,
    section: null,
    roles: ['Super Admin'],
    synonyms: ['roles', 'role', 'permissions', 'access control', 'rbac', 'privileges', 'rights', 'security roles', 'access rights', 'permission matrix']
  },
  {
    id: 'org-branches',
    title: 'Dealership Branches',
    breadcrumb: 'Organisation → Branches',
    description: 'Showroom and warehouse locations, branch details, and operational status.',
    route: '/organisation/branches',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['branches', 'branch', 'locations', 'showrooms', 'dealership', 'dealerships', 'organisation', 'organization', 'branch settings']
  },

  // --- SYSTEM: SETTINGS TABS (/system/settings - Super Admin only) ---
  {
    id: 'settings-business-profile',
    title: 'Business Profile & Legal Entity',
    breadcrumb: 'System → Settings → Business Profile',
    description: 'Legal company name, official branding, tax registration (NTN), currency, and address.',
    route: '/system/settings',
    tab: 'Business Profile',
    section: 'section-business-profile',
    roles: ['Super Admin'],
    synonyms: ['organisation', 'organization', 'business profile', 'company', 'legal entity', 'branding', 'tax', 'ntn', 'currency', 'timezone', 'address', 'business name', 'head office']
  },
  {
    id: 'settings-branch-defaults',
    title: 'Branch Operational Defaults',
    breadcrumb: 'System → Settings → Branch Defaults',
    description: 'Configure standard opening hours, local expense thresholds (PKR 100K), and manager discount allowances.',
    route: '/system/settings',
    tab: 'Branch Defaults',
    section: 'section-branch-defaults',
    roles: ['Super Admin'],
    synonyms: ['branch defaults', 'operating hours', 'expense limit', 'discount limit', 'working hours', 'branch policy', 'thresholds', 'defaults']
  },
  {
    id: 'settings-product-master-data',
    title: 'Catalogue Settings (Product Master Data)',
    breadcrumb: 'System → Settings → Product Master Data',
    description: 'Configure serialized tracking, canonical SKU formatting rules, and standard warranty periods.',
    route: '/system/settings',
    tab: 'Product Master Data',
    section: 'section-product-master-data',
    roles: ['Super Admin'],
    synonyms: ['catalogue settings', 'catalog settings', 'products', 'sku', 'sku format', 'warranty default', 'tracking', 'serial tracking', 'master data', 'serialized units']
  },
  {
    id: 'settings-statuses',
    title: 'Inventory Statuses & Workflow Lifecycles',
    breadcrumb: 'System → Settings → Statuses',
    description: 'Canonical workflow lifecycle statuses for vehicles, purchase orders, and product states.',
    route: '/system/settings',
    tab: 'Statuses',
    section: 'section-statuses',
    roles: ['Super Admin'],
    synonyms: ['inventory settings', 'inventory', 'statuses', 'lifecycles', 'unit status', 'po status', 'product status', 'workflow states', 'lifecycle stages']
  },
  {
    id: 'settings-pricing-rules',
    title: 'Pricing Rules & Margins',
    breadcrumb: 'System → Settings → Pricing Rules',
    description: 'Global margin targets (15% floor), pricing strategies, and manager discount approval thresholds.',
    route: '/system/settings',
    tab: 'Pricing Rules',
    section: 'section-pricing-rules',
    roles: ['Super Admin'],
    synonyms: ['pricing settings', 'pricing rules', 'pricing', 'margins', 'margin floor', 'markup', 'discount threshold', 'price rules', 'approval threshold']
  },
  {
    id: 'settings-payment-methods',
    title: 'Payment Methods & Rails',
    breadcrumb: 'System → Settings → Payment Methods',
    description: 'Configure accepted sales payment methods (Cash, Bank Transfer, POS/Card) and transaction references.',
    route: '/system/settings',
    tab: 'Payment Methods',
    section: 'section-payment-methods',
    roles: ['Super Admin'],
    synonyms: ['sales settings', 'finance settings', 'payment methods', 'payments', 'cash', 'bank transfer', 'pos', 'card', 'payment rails', 'checkout rules']
  },
  {
    id: 'settings-expense-categories',
    title: 'Expense Categories & Rules',
    breadcrumb: 'System → Settings → Expense Categories',
    description: 'Chart of operational expense categories (Salaries, Rent, Utilities, Marketing) and approval tiers.',
    route: '/system/settings',
    tab: 'Expense Categories',
    section: 'section-expense-categories',
    roles: ['Super Admin'],
    synonyms: ['finance settings', 'expense categories', 'expenses', 'salaries', 'rent', 'utilities', 'marketing', 'financial categories', 'expense approval']
  },
  {
    id: 'settings-approval-rules',
    title: 'Approval Rules & Limits',
    breadcrumb: 'System → Settings → Approval Rules',
    description: 'Governance rules and limits for Expenses, Discounts, Stock Adjustments, and Customer Refunds.',
    route: '/system/settings',
    tab: 'Approval Rules',
    section: 'section-approval-rules',
    roles: ['Super Admin'],
    synonyms: ['approval rules', 'approvals', 'limits', 'thresholds', 'expense limits', 'refund approvals', 'discount approvals', 'stock adjustment approval', 'finance settings']
  },
  {
    id: 'settings-numbering',
    title: 'Document Numbering & Sequences',
    breadcrumb: 'System → Settings → Numbering',
    description: 'Prefix sequences and counters for Orders (SO-), Quotes (QT-), Invoices (INV-), POs (PO-), and Service (SC-).',
    route: '/system/settings',
    tab: 'Numbering',
    section: 'section-numbering',
    roles: ['Super Admin'],
    synonyms: ['numbering', 'numbering sequences', 'prefixes', 'prefix', 'invoice numbering', 'order prefix', 'quote prefix', 'sequences', 'service settings', 'sales settings']
  },
  {
    id: 'settings-notifications-tab',
    title: 'System Notification Rules',
    breadcrumb: 'System → Settings → Notifications',
    description: 'Automated notification distribution rules for PO approvals, low stock alerts, and security logins.',
    route: '/system/settings',
    tab: 'Notifications',
    section: 'section-notifications',
    roles: ['Super Admin'],
    synonyms: ['notifications', 'notification settings', 'notification rules', 'alerts', 'email alerts', 'alert rules', 'triggers', 'po approval alert', 'low stock']
  },
  {
    id: 'settings-data-import-export',
    title: 'Data Import & Export',
    breadcrumb: 'System → Settings → Data Import & Export',
    description: 'Governed CSV imports, opening inventory setup, and role-controlled export permissions.',
    route: '/system/settings',
    tab: 'Data Import & Export',
    section: 'section-data-import-export',
    roles: ['Super Admin'],
    synonyms: ['data import', 'data export', 'import', 'export', 'csv', 'opening inventory', 'backup', 'data tools']
  },
  {
    id: 'settings-integrations',
    title: 'Connected External Integrations',
    breadcrumb: 'System → Settings → Integrations',
    description: 'Manage external service connections for Email SMTP notifications, WhatsApp messaging, and accounting.',
    route: '/system/settings',
    tab: 'Integrations',
    section: 'section-integrations',
    roles: ['Super Admin'],
    synonyms: ['integrations', 'connected services', 'email', 'smtp', 'whatsapp', 'accounting export', 'webhooks', 'api', 'third party']
  },
  {
    id: 'settings-security-policy',
    title: 'Security Policy & Password Constraints',
    breadcrumb: 'System → Settings → Security',
    description: 'Global mandatory MFA enforcement, 60-minute session timeout, and password complexity requirements.',
    route: '/system/settings',
    tab: 'Security',
    section: 'section-security',
    roles: ['Super Admin'],
    synonyms: ['password', 'passwords', 'security', 'mfa', '2fa', 'session timeout', 'password policy', 'mfa policy', 'credentials', 'security policy', 'two-factor authentication']
  },

  // --- SYSTEM: DEDICATED SECURITY & SESSIONS (/system/security - Super Admin only) ---
  {
    id: 'system-security-sessions',
    title: 'MFA & Active Sessions',
    breadcrumb: 'System → Security & Sessions → MFA',
    description: 'Inspect active browser/mobile login sessions, revoke sessions, and review security audits.',
    route: '/system/security',
    tab: null,
    section: 'section-mfa',
    roles: ['Super Admin'],
    synonyms: ['mfa', '2fa', 'two-factor', 'multi-factor authentication', 'sessions', 'active sessions', 'login security', 'devices', 'revoke session', 'security history']
  },

  // --- SYSTEM: PREFERENCES & ACCOUNT (Both Super Admin & Branch Manager) ---
  {
    id: 'system-account-profile',
    title: 'Account Profile',
    breadcrumb: 'System → Account Profile',
    description: 'Update your personal name, official email, contact phone, and notification preferences.',
    route: '/system/account',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['account', 'profile', 'my profile', 'email', 'phone', 'contact preference', 'personal profile', 'user settings', 'password update']
  },
  {
    id: 'system-preferences-theme',
    title: 'Preferences & System Theme',
    breadcrumb: 'System → Preferences',
    description: 'Display theme (Light/Dark mode), table density (Comfortable/Compact), language, and alert preferences.',
    route: '/system/preferences',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['preferences', 'theme', 'dark mode', 'light mode', 'table density', 'density', 'language', 'display settings', 'sound effects', 'ui settings', 'alerts']
  },
  {
    id: 'system-audit-log',
    title: 'Audit Log & History',
    breadcrumb: 'System → Audit Log',
    description: 'Chronological activity history, data changes, security events, and compliance records.',
    route: '/system/audit-log',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['audit', 'history', 'audit log', 'event log', 'activity history', 'audit trail', 'logs', 'compliance', 'historical records']
  },
  {
    id: 'system-branch-team',
    title: 'Branch Team Roster',
    breadcrumb: 'System → Branch Team',
    description: 'Branch staff roster, operational duty assignments, and showroom team roles.',
    route: '/system/branch-team',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['branch team', 'team', 'staff roster', 'team members', 'branch staff', 'staff', 'branch users']
  },

  // --- CATALOGUE PRICING (/catalogue/pricing - Super Admin only) ---
  {
    id: 'catalogue-pricing-rules',
    title: 'Catalogue Pricing Settings',
    breadcrumb: 'Catalogue → Pricing Rules',
    description: 'Model price lists, wholesale and retail tiers, margin floors, and price rule configurations.',
    route: '/catalogue/pricing',
    tab: null,
    section: null,
    roles: ['Super Admin'],
    synonyms: ['pricing settings', 'catalogue settings', 'pricing', 'price list', 'margin rules', 'price tiers', 'pricing table']
  },

  // --- COMMUNICATION NOTIFICATIONS (Both Super Admin & Branch Manager) ---
  {
    id: 'communication-notifications-center',
    title: 'Notifications Center',
    breadcrumb: 'Communication → Notifications',
    description: 'System communication feed, unread alerts, operational notifications, and broadcasts.',
    route: '/communication/notifications',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['notifications', 'alerts', 'inbox', 'messages', 'notices', 'bulletins', 'system alerts']
  },

  // --- AFTER-SALES: SERVICE & WARRANTY (Both Super Admin & Branch Manager) ---
  {
    id: 'service-warranty-settings',
    title: 'Service & Warranty Settings',
    breadcrumb: 'After-Sales → Warranty & Service',
    description: 'Warranty service case governance, battery health (SOH) diagnostics, and repair policies.',
    route: '/after-sales/warranty',
    tab: null,
    section: null,
    roles: ['Super Admin', 'Branch Manager'],
    synonyms: ['service settings', 'warranty settings', 'service', 'warranty', 'after-sales', 'repairs', 'diagnostic', 'soh', 'claims']
  }
]

// Filtered by current user role: Super Admin vs Branch Manager
const accessibleSettings = computed(() => {
  const currentRole = currentUserRole.value
  return SETTINGS_INDEX.filter(item => {
    if (isSuperAdmin.value) {
      return item.roles.includes('Super Admin')
    }
    // Branch Manager must only see settings permitted to Branch Manager
    return item.roles.includes(currentRole) || (item.roles.includes('Branch Manager') && store?.isBranchUser?.())
  })
})

// Search matching logic with score-based sorting
const filteredResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)

  const scored = accessibleSettings.value.map(item => {
    let score = 0
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()
    const breadcrumbLower = item.breadcrumb.toLowerCase()
    const tabLower = (item.tab || '').toLowerCase()

    // 1. Exact phrase match
    if (titleLower.includes(q)) score += 100
    if (breadcrumbLower.includes(q)) score += 60
    if (tabLower.includes(q)) score += 50
    if (descLower.includes(q)) score += 20

    // 2. Synonyms exact/partial match
    for (const syn of item.synonyms) {
      const synLower = syn.toLowerCase()
      if (synLower === q) {
        score += 80
      } else if (synLower.includes(q)) {
        score += 40
      }
    }

    // 3. Token-level matching
    let allTokensMatch = true
    for (const t of tokens) {
      const tokenInTitle = titleLower.includes(t)
      const tokenInBreadcrumb = breadcrumbLower.includes(t)
      const tokenInDesc = descLower.includes(t)
      const tokenInTab = tabLower.includes(t)
      const tokenInSynonym = item.synonyms.some(s => s.toLowerCase().includes(t))

      if (tokenInTitle) score += 25
      else if (tokenInBreadcrumb) score += 15
      else if (tokenInTab) score += 15
      else if (tokenInSynonym) score += 12
      else if (tokenInDesc) score += 5
      else {
        allTokensMatch = false
      }
    }

    if (allTokensMatch) {
      score += 30
    }

    return { item, score }
  })

  return scored
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.item)
})

const onInput = () => {
  isOpen.value = true
  selectedIndex.value = filteredResults.value.length > 0 ? 0 : -1
}

const onFocus = () => {
  if (query.value.trim()) {
    isOpen.value = true
  }
}

const onKeyDownDown = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  const len = filteredResults.value.length
  if (len > 0) {
    selectedIndex.value = (selectedIndex.value + 1) % len
    scrollSelectedIntoView()
  }
}

const onKeyDownUp = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  const len = filteredResults.value.length
  if (len > 0) {
    selectedIndex.value = (selectedIndex.value - 1 + len) % len
    scrollSelectedIntoView()
  }
}

const onKeyDownEnter = () => {
  if (isOpen.value && selectedIndex.value >= 0 && filteredResults.value[selectedIndex.value]) {
    selectSetting(filteredResults.value[selectedIndex.value])
  }
}

const onKeyDownEscape = () => {
  isOpen.value = false
  selectedIndex.value = -1
  inputRef.value?.blur()
}

const scrollSelectedIntoView = () => {
  nextTick(() => {
    const activeEl = rootRef.value?.querySelector(`[data-result-index="${selectedIndex.value}"]`)
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

const selectSetting = (item) => {
  if (!item) return

  isOpen.value = false
  selectedIndex.value = -1

  const queryParams = {}
  if (item.tab) queryParams.tab = item.tab
  if (item.section) queryParams.section = item.section

  // If already on the target route, replace query so reactive watchers trigger tab/section switch
  if (route.path === item.route) {
    router.replace({ path: item.route, query: queryParams }).catch(() => {})
  } else {
    router.push({ path: item.route, query: queryParams }).catch(() => {})
  }
}

// Global click-outside listener to close panel
const handleClickOutside = (e) => {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    isOpen.value = false
    selectedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Expose internal state and index for testing
defineExpose({
  query,
  isOpen,
  selectedIndex,
  filteredResults,
  accessibleSettings,
  selectSetting,
  SETTINGS_INDEX
})
</script>

<template>
  <div 
    ref="rootRef" 
    class="relative max-w-md w-full settings-search-container"
    data-tour-id="shared.layout.header.settings-search"
  >
    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
    <input 
      ref="inputRef"
      v-model="query"
      :data-tour-id="tourId"
      type="text" 
      placeholder="Search settings..." 
      autocomplete="off"
      spellcheck="false"
      class="w-full pl-9 pr-4 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] focus:ring-1 focus:ring-[#165A31] transition-colors"
      @input="onInput"
      @focus="onFocus"
      @keydown.down.prevent="onKeyDownDown"
      @keydown.up.prevent="onKeyDownUp"
      @keydown.enter.prevent="onKeyDownEnter"
      @keydown.esc.prevent="onKeyDownEscape"
    />

    <!-- Settings Search Results Dropdown -->
    <div 
      v-if="isOpen && query.trim()" 
      class="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[360px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Results list -->
      <div v-if="filteredResults.length > 0" class="py-1.5 divide-y divide-gray-50">
        <div 
          v-for="(item, idx) in filteredResults" 
          :key="item.id"
          :data-result-index="idx"
          @click="selectSetting(item)"
          @mousedown="selectSetting(item)"
          @mouseenter="selectedIndex = idx"
          class="px-3.5 py-2.5 cursor-pointer transition-colors flex items-start justify-between gap-3"
          :class="selectedIndex === idx ? 'bg-emerald-50/80 text-gray-900' : 'hover:bg-gray-50 text-gray-700'"
        >
          <div class="flex-1 min-w-0">
            <!-- Breadcrumb Path -->
            <div class="text-[10px] font-semibold text-[#165A31] flex items-center gap-1 mb-0.5 truncate">
              <Sliders class="w-3 h-3 text-[#165A31] flex-shrink-0" />
              <span>{{ item.breadcrumb }}</span>
            </div>
            <!-- Setting Name -->
            <div class="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
              <span>{{ item.title }}</span>
              <span v-if="item.tab" class="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                Tab: {{ item.tab }}
              </span>
            </div>
            <!-- Description -->
            <div class="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
              {{ item.description }}
            </div>
          </div>

          <!-- Enter prompt on active item -->
          <div v-if="selectedIndex === idx" class="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#165A31] pt-1 flex-shrink-0">
            <span>Open</span>
            <CornerDownLeft class="w-3 h-3" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-6 text-center space-y-1">
        <div class="text-xs font-medium text-gray-600">
          No matching settings found.
        </div>
        <div class="text-[11px] text-gray-400">
          Try searching for users, roles, mfa, passwords, branches, pricing, or numbering.
        </div>
      </div>
    </div>
  </div>
</template>
