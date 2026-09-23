<script setup>
import { ref, computed, watch } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { 
  Home, Building2, LayoutGrid, FileText, Package, Users, 
  PlusCircle, CircleDollarSign, MessageSquare, PieChart, 
  Settings, Search, Bell, MessageCircle, Moon, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, Menu, X, Lock
} from 'lucide-vue-next'
import { store } from '@/store.js'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const isSidebarCollapsed = ref(false)

const user = computed(() => store.currentUser)
const isBranchUser = computed(() => store.isBranchUser())

const userInitials = computed(() => {
  if (!user.value || !user.value.name) return 'SA'
  const parts = user.value.name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return user.value.name.substring(0, 2).toUpperCase()
})

const selectedBranchScope = ref(store.getActiveBranch())

watch(() => store.currentUser, () => {
  selectedBranchScope.value = store.getActiveBranch()
}, { deep: true })

const selectBranchScope = (branchName) => {
  if (isBranchUser.value) return // Branch users cannot change branch scope
  selectedBranchScope.value = branchName
  openDropdown.value = null
}

const handleLogout = () => {
  store.logout()
  router.push('/login')
}

const navigation = computed(() => {
  if (isBranchUser.value) {
    return [
      { name: 'HOME', icon: Home, expanded: true, subItems: [
        { name: 'Dashboard', route: '/dashboard' },
        { name: 'Action Centre', route: '/dashboard/action-centre' }
      ]},
      { name: 'CATALOGUE', icon: LayoutGrid, expanded: false, subItems: [
        { name: 'Products', route: '/catalogue/products' },
        { name: 'Product Requests', route: '/catalogue/requests' }
      ]},
      { name: 'INVENTORY', icon: Package, expanded: false, subItems: [
        { name: 'My Inventory', route: '/inventory/dashboard' },
        { name: 'Stock by Product', route: '/inventory/stock-by-product' },
        { name: 'Serialized Units', route: '/inventory/serialized-units' },
        { name: 'Stock Requests', route: '/inventory/stock-requests' },
        { name: 'Transfers', route: '/inventory/transfers' },
        { name: 'Inbound Deliveries', route: '/inventory/inbound-deliveries' },
        { name: 'Adjustments', route: '/inventory/stock-adjustments' },
        { name: 'Cycle Counts', route: '/inventory/cycle-counts' },
        { name: 'Stock Movements', route: '/inventory/stock-movement-ledger' },
        { name: 'Damaged / Quarantine', route: '/inventory/quarantine' }
      ]},
      { name: 'SALES & CUSTOMERS', icon: Users, expanded: false, subItems: [
        { name: 'Sales', route: '/sales/dashboard' },
        { name: 'Quotations', route: '/sales/quotations' },
        { name: 'Orders', route: '/sales/orders' },
        { name: 'Invoices', route: '/sales/invoices' },
        { name: 'Payments', route: '/sales/payments' },
        { name: 'Delivery / Handover', route: '/sales/delivery' },
        { name: 'Returns & Refunds', route: '/sales/returns' },
        { name: 'Customers', route: '/sales/customers' },
        { name: 'Leads', route: '/sales/leads' },
        { name: 'Follow-ups', route: '/sales/follow-ups' },
        { name: 'Custom Orders', route: '/sales/custom-orders' }
      ]},
      { name: 'AFTER-SALES', icon: PlusCircle, expanded: false, subItems: [
        { name: 'Warranty & Service', route: '/after-sales/warranty' },
        { name: 'Repairs', route: '/after-sales/repairs' }
      ]},
      { name: 'EXPENSES', icon: CircleDollarSign, expanded: false, subItems: [
        { name: 'Expenses', route: '/finance/expenses' },
        { name: 'Expense Summary', route: '/finance/overview' }
      ]},
      { name: 'COMMUNICATION', icon: MessageSquare, expanded: false, subItems: [
        { name: 'Management Inbox', route: '/communication/inbox' },
        { name: 'Notifications', route: '/communication/notifications' }
      ]},
      { name: 'ANALYTICS', icon: PieChart, expanded: false, subItems: [
        { name: 'My Branch Reports', route: '/analytics/reports-hub' }
      ]},
      { name: 'SYSTEM', icon: Settings, expanded: false, subItems: [
        { name: 'Branch Team', route: '/system/branch-team' },
        { name: 'Account', route: '/system/account' },
        { name: 'Security', route: '/system/security' },
        { name: 'Preferences', route: '/system/preferences' },
        { name: 'Logout', route: '/system/logout' }
      ]}
    ]
  }
  return [
    { name: 'HOME', icon: Home, expanded: false, subItems: [
      { name: 'Dashboard', route: '/dashboard' },
      { name: 'Branch Performance', route: '/dashboard/branch-performance' },
      { name: 'Business Performance', route: '/dashboard/business-performance' },
      { name: 'Action Centre', route: '/dashboard/action-centre' }
    ]},
    { name: 'ORGANISATION', icon: Building2, expanded: false, subItems: [
      { name: 'Branches', route: '/organisation/branches' },
      { name: 'Users & Access', route: '/organisation/users' },
      { name: 'Roles & Permissions', route: '/organisation/roles' }
    ]},
    { name: 'CATALOGUE', icon: LayoutGrid, expanded: false, subItems: [
      { name: 'Categories', route: '/catalogue/categories' },
      { name: 'Products', route: '/catalogue/products' },
      { name: 'Pricing', route: '/catalogue/pricing' },
      { name: 'Product Requests', route: '/catalogue/requests' }
    ]},
    { name: 'PROCUREMENT', icon: FileText, expanded: false, subItems: [
      { name: 'Suppliers', route: '/procurement/suppliers' },
      { name: 'Purchase Orders', route: '/procurement/purchase-orders' },
      { name: 'Receipts', route: '/procurement/receipts' },
      { name: 'Landed Costs', route: '/procurement/landed-costs' },
      { name: 'Vendor Bills', route: '/procurement/vendor-bills' },
      { name: 'Purchase Returns', route: '/procurement/purchase-returns' }
    ]},
    { name: 'INVENTORY', icon: Package, expanded: false, subItems: [
      { name: 'Inventory Dashboard', route: '/inventory/dashboard' },
      { name: 'Stock by Product', route: '/inventory/stock-by-product' },
      { name: 'Serialized Units', route: '/inventory/serialized-units' },
      { name: 'Transfers', route: '/inventory/transfers' },
      { name: 'Stock Requests', route: '/inventory/stock-requests' },
      { name: 'Stock Adjustments', route: '/inventory/stock-adjustments' },
      { name: 'Cycle Counts', route: '/inventory/cycle-counts' },
      { name: 'Stock Movement Ledger', route: '/inventory/stock-movement-ledger' },
      { name: 'Damaged / Quarantine / Scrap', route: '/inventory/quarantine' }
    ]},
    { name: 'SALES & CRM', icon: Users, expanded: false, subItems: [
      { name: 'Sales Dashboard', route: '/sales/dashboard' },
      { name: 'Quotations', route: '/sales/quotations' },
      { name: 'Orders', route: '/sales/orders' },
      { name: 'Invoices', route: '/sales/invoices' },
      { name: 'Payments', route: '/sales/payments' },
      { name: 'Customers', route: '/sales/customers' },
      { name: 'Leads & Inquiries', route: '/sales/leads' },
      { name: 'Follow-ups', route: '/sales/follow-ups' },
      { name: 'Custom Orders / Reservations', route: '/sales/custom-orders' },
      { name: 'Returns & Refunds', route: '/sales/returns' },
      { name: 'Delivery / Handover', route: '/sales/delivery' }
    ]},
    { name: 'AFTER-SALES', icon: PlusCircle, expanded: false, subItems: [
      { name: 'After-sales Dashboard', route: '/after-sales/dashboard' },
      { name: 'Warranty & Service', route: '/after-sales/warranty' },
      { name: 'Repair Jobs', route: '/after-sales/repairs' }
    ]},
    { name: 'FINANCE', icon: CircleDollarSign, expanded: false, subItems: [
      { name: 'Expenses', route: '/finance/expenses' },
      { name: 'Finance Overview', route: '/finance/overview' },
      { name: 'Receivables', route: '/finance/receivables' },
      { name: 'Payables', route: '/finance/payables' },
      { name: 'Cash / Bank', route: '/finance/cash-bank' }
    ]},
    { name: 'COMMUNICATION', icon: MessageSquare, expanded: false, subItems: [
      { name: 'Management Inbox', route: '/communication/inbox' },
      { name: 'Notifications', route: '/communication/notifications' }
    ]},
    { name: 'ANALYTICS', icon: PieChart, expanded: false, subItems: [
      { name: 'Reports Hub', route: '/analytics/reports-hub' },
      { name: 'Sales Report', route: '/analytics/reports/sales' },
      { name: 'Inventory Report', route: '/analytics/reports/inventory' },
      { name: 'Procurement Report', route: '/analytics/reports/procurement' },
      { name: 'Expense Report', route: '/analytics/reports/expense' },
      { name: 'Profitability Report', route: '/analytics/reports/profitability' },
      { name: 'CRM Report', route: '/analytics/reports/crm' },
      { name: 'Branch Report', route: '/analytics/reports/branch' }
    ]},
    { name: 'SYSTEM', icon: Settings, expanded: false, subItems: [
      { name: 'Audit Log', route: '/system/audit-log' },
      { name: 'Settings', route: '/system/settings' },
      { name: 'Account', route: '/system/account' },
      { name: 'Security & Sessions', route: '/system/security' },
      { name: 'Preferences', route: '/system/preferences' },
      { name: 'Logout', route: '/system/logout' }
    ]}
  ]
})

const expandedSections = ref({ HOME: true })

const toggleExpand = (item) => {
  const current = expandedSections.value[item.name]
  expandedSections.value = { [item.name]: !current }
}

const isActive = (path) => {
  if (path === '#') return false
  if (route.path === path) return true
  if (path === '/dashboard') return false
  return route.path.startsWith(path + '/')
}

const isParentActive = (item) => {
  return item.subItems.some(sub => isActive(sub.route))
}

const isSectionExpanded = (item) => {
  if (expandedSections.value[item.name] !== undefined) {
    return expandedSections.value[item.name]
  }
  return isParentActive(item)
}

// Auto-expand the parent section if one of its children is active
watch(() => route.path, () => {
  navigation.value.forEach(item => {
    if (isParentActive(item)) {
      expandedSections.value[item.name] = true
    }
  })
  isMobileMenuOpen.value = false
}, { immediate: true })

const openDropdown = ref(null)
const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}
const closeDropdowns = () => {
  openDropdown.value = null
}

const unreadNotificationCount = computed(() => store.getUnreadNotificationCount(store.currentUser))
const scopedNotifications = computed(() => store.getNotificationsForUser(store.currentUser))
const topAlerts = computed(() => scopedNotifications.value.slice(0, 5))
const unreadMessagesCount = computed(() => store.getUnreadConversationCount(store.currentUser))

const handleAlertClick = (alert) => {
  store.markNotificationRead(alert.id)
  openDropdown.value = null
  if (alert.link) {
    router.push(alert.link)
  } else {
    router.push('/communication/notifications')
  }
}

const openMessages = () => {
  router.push('/communication/inbox')
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50/50 relative overflow-x-hidden">
    <!-- Click-away overlay for dropdowns -->
    <div v-if="openDropdown" @click="closeDropdowns" class="fixed inset-0 z-30"></div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-[#f9fafb] border-r border-gray-100 flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative',
        isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo Area -->
      <div class="h-[72px] px-6 flex items-center" :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">
        <div class="flex items-center gap-3">
          <div class="bg-[#165A31] text-white font-bold text-sm rounded w-8 h-8 flex items-center justify-center shrink-0">
            AJ
          </div>
          <div v-if="!isSidebarCollapsed">
            <h1 class="font-bold tracking-widest text-xs text-gray-900 leading-tight whitespace-nowrap uppercase">{{ store.settings?.company?.name || 'AJ ECODRIVE' }}</h1>
            <p class="text-[8px] tracking-widest text-gray-500 whitespace-nowrap uppercase">{{ store.settings?.company?.brand || 'BRG MANAGEMENT SYSTEM' }}</p>
          </div>
        </div>
        <button v-if="!isSidebarCollapsed" @click="isMobileMenuOpen = false" class="lg:hidden w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded bg-white border border-gray-200 shrink-0">
          <X class="w-3.5 h-3.5" />
        </button>
        <button @click="isSidebarCollapsed = !isSidebarCollapsed" class="hidden lg:flex w-6 h-6 items-center justify-center text-gray-400 hover:text-gray-600 rounded bg-white border border-gray-200 shrink-0" :class="isSidebarCollapsed ? 'absolute -right-3 top-6 z-50 shadow-sm' : ''">
          <component :is="isSidebarCollapsed ? ChevronsRight : ChevronsLeft" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Workspace / Signed In Card -->
      <div class="px-6 py-4" v-if="!isSidebarCollapsed">
        <div v-if="isBranchUser" class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-3 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div class="text-[9px] font-bold text-gray-400 tracking-wider uppercase">WORKSPACE</div>
          <div class="text-xs font-bold text-[#165A31] mt-0.5">Branch Manager</div>
        </div>
        <div v-else class="bg-white border border-gray-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
          <div>
            <div class="text-[9px] font-bold text-gray-400 tracking-wider">SIGNED IN AS</div>
            <div class="text-xs font-bold text-[#165A31]">{{ user.role || 'Super Admin' }}</div>
          </div>
          <div class="text-[10px] text-gray-400 font-medium">
            {{ user.branchCode ? `${user.branchName} (${user.branchCode})` : (user.branchName || 'All Branches') }}
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <div v-for="item in navigation" :key="item.name" class="mb-1" :title="isSidebarCollapsed ? item.name : ''">
          <!-- Main Category -->
          <button 
            @click="!isSidebarCollapsed && toggleExpand(item)"
            class="w-full flex items-center px-3 py-2 rounded-lg transition-colors group"
            :class="[(isParentActive(item) || (isSectionExpanded(item) && !isSidebarCollapsed)) ? 'bg-[#eefcf2] text-[#165A31]' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900', isSidebarCollapsed ? 'justify-center' : 'justify-between']"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-4 h-4 shrink-0" :class="(isParentActive(item) || (isSectionExpanded(item) && !isSidebarCollapsed)) ? 'text-[#165A31]' : 'text-gray-400 group-hover:text-gray-600'" />
              <span v-if="!isSidebarCollapsed" class="text-[11px] font-bold tracking-wider whitespace-nowrap">{{ item.name }}</span>
            </div>
            <template v-if="!isSidebarCollapsed">
              <ChevronDown v-if="isSectionExpanded(item)" class="w-3.5 h-3.5 shrink-0" :class="(isParentActive(item) || isSectionExpanded(item)) ? 'text-[#165A31]' : 'text-gray-400'" />
              <ChevronRight v-else class="w-3.5 h-3.5 shrink-0" :class="(isParentActive(item) || isSectionExpanded(item)) ? 'text-[#165A31]' : 'text-gray-400'" />
            </template>
          </button>
          
          <!-- Sub Items -->
          <div v-show="!isSidebarCollapsed && isSectionExpanded(item)" class="mt-1 space-y-0.5">
            <RouterLink 
              v-for="sub in item.subItems" 
              :key="sub.name"
              :to="sub.route"
              class="block px-10 py-2 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap"
              :class="isActive(sub.route) ? 'bg-[#eefcf2] text-[#165A31] font-bold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#165A31] before:rounded-r-full' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'"
            >
              {{ sub.name }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Bottom Profile -->
      <div @click="router.push('/system/account')" class="p-6 border-t border-gray-100 flex items-center cursor-pointer hover:bg-gray-50" :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#eefcf2] text-[#165A31] border border-[#d1f4e0] flex items-center justify-center text-[10px] font-bold shrink-0">
            {{ isBranchUser ? 'BM' : userInitials }}
          </div>
          <div v-if="!isSidebarCollapsed">
            <div class="text-[11px] font-bold text-gray-900 whitespace-nowrap">{{ isBranchUser ? 'Branch Manager' : (user.name || 'Super Admin') }}</div>
            <div class="text-[9px] text-gray-500 whitespace-nowrap max-w-[150px] truncate">{{ isBranchUser ? `${user.branchName} Branch` : (user.email || 'admin@ajecodrive.com') }}</div>
          </div>
        </div>
        <ChevronRight v-if="!isSidebarCollapsed" class="w-4 h-4 text-gray-400 shrink-0" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 bg-[#fbfbfc] transition-all duration-300">
      <!-- Header -->
      <header class="bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-0 lg:h-[72px] flex-shrink-0 relative z-30">
        <!-- Left Section (Menu Toggle & Branch/Date) -->
        <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <!-- Mobile Menu Toggle -->
          <button @click="isMobileMenuOpen = true" class="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden flex-shrink-0">
            <Menu class="w-5 h-5" />
          </button>

          <div class="hidden sm:flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <!-- Branch Scope / Working In -->
            <div v-if="isBranchUser" class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-1.5 flex flex-col justify-center">
              <span class="text-[8px] font-bold text-gray-400 tracking-wider uppercase">WORKING IN</span>
              <span class="text-xs font-bold text-[#165A31] flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#165A31]"></span>
                {{ user.branchName }} Branch
              </span>
            </div>
            <div v-else class="relative">
              <button 
                @click="toggleDropdown('branch')" 
                class="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-colors hover:text-gray-900 cursor-pointer"
              >
                <span class="hidden xl:inline">Viewing: </span>
                <span class="font-bold whitespace-nowrap">{{ selectedBranchScope }}</span>
                <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
              </button>

              <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1">Branch Scope</div>
                <button 
                  @click="selectBranchScope('All Branches')"
                  class="w-full text-left px-4 py-2 text-xs flex items-center justify-between"
                  :class="selectedBranchScope === 'All Branches' ? 'font-bold text-[#165A31] bg-[#eefcf2]' : 'text-gray-600 hover:bg-gray-50'"
                >
                  All Branches
                  <svg v-if="selectedBranchScope === 'All Branches'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button 
                  v-for="b in ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']"
                  :key="b"
                  @click="selectBranchScope(`${b} Branch`)"
                  class="w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors"
                  :class="selectedBranchScope === `${b} Branch` ? 'font-bold text-[#165A31] bg-[#eefcf2]' : 'text-gray-600 hover:bg-gray-50'"
                >
                  {{ b }} Branch
                  <svg v-if="selectedBranchScope === `${b} Branch`" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <div class="border-t border-gray-50 mt-1 pt-1">
                  <button @click="openDropdown = null; router.push('/organisation/branches')" class="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    Manage branches
                    <ChevronRight class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Date Range -->
            <div class="relative">
              <button @click="toggleDropdown('date')" class="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span class="font-bold whitespace-nowrap">This Month</span>
                <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
              </button>
              <div v-if="openDropdown === 'date'" class="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1">Date Range</div>
                <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Today</button>
                <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Last 7 days</button>
                <button class="w-full text-left px-4 py-2 text-xs font-bold text-[#165A31] bg-[#eefcf2] flex items-center justify-between">
                  Last 30 days
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">This month</button>
                <div class="border-t border-gray-50 mt-1 pt-1">
                  <button class="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    Custom range...
                  </button>
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="relative max-w-md w-full ml-2 hidden md:block">
              <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                :placeholder="isBranchUser ? `Search within ${user.branchName} Branch...` : 'Search products...'" 
                class="w-full pl-9 pr-4 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] focus:ring-1 focus:ring-[#165A31] transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Right Section (Actions & Profile) -->
        <div class="flex items-center gap-2 sm:gap-3 ml-4 flex-shrink-0">
          <!-- Quick Sale / Quick Create Button -->
          <div class="relative">
            <button 
              @click="isBranchUser ? router.push('/sales/orders') : toggleDropdown('create')" 
              class="bg-[#165A31] text-white text-[11px] font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-[#124a28] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
            >
              <span>{{ isBranchUser ? '+ Quick Sale' : '+ Quick Create' }}</span>
              <ChevronDown v-if="!isBranchUser" class="w-3.5 h-3.5 opacity-70" />
            </button>
            <div v-if="openDropdown === 'create' && !isBranchUser" class="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
              <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1">Quick Create</div>
              <button @click="openDropdown = null; router.push('/sales/orders')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
                New Sale / POS
                <span class="text-[10px] text-gray-400">Ctrl+S</span>
              </button>
              <button @click="openDropdown = null; router.push('/procurement/purchase-orders')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Purchase Order</button>
              <button @click="openDropdown = null; router.push('/sales/customers')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Customer</button>
              <button @click="openDropdown = null; router.push('/inventory/transfers')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Stock Transfer</button>
              <button @click="openDropdown = null; router.push('/finance/expenses')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Expense</button>
              <button @click="openDropdown = null; router.push('/after-sales/warranty')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Warranty / Service Case</button>
            </div>
          </div>

          <!-- Quick Actions dropdown for Branch Manager -->
          <div v-if="isBranchUser" class="relative hidden sm:block">
            <button @click="toggleDropdown('quickActions')" class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center gap-1 cursor-pointer">
              <span>Quick Actions</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'quickActions'" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 text-xs">
              <button @click="openDropdown = null; router.push('/sales/orders')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">New Order</button>
              <button @click="openDropdown = null; router.push('/inventory/stock-requests')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Stock Request</button>
              <button @click="openDropdown = null; router.push('/finance/expenses')" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Log Expense</button>
            </div>
          </div>
          
          <div class="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-3 sm:pl-4">
            <button @click="openMessages" class="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
              <span>Messages</span>
              <span v-if="unreadMessagesCount > 0" class="px-1.5 py-0.2 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px]">{{ unreadMessagesCount }}</span>
            </button>
            
            <!-- Notifications / Alerts -->
            <div class="relative">
              <button @click="toggleDropdown('notifications')" class="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 cursor-pointer">
                <span class="hidden sm:inline">Alerts</span>
                <span v-if="unreadNotificationCount > 0" class="px-1.5 py-0.2 bg-emerald-100 text-[#165A31] font-bold rounded-full text-[10px]">{{ unreadNotificationCount }}</span>
              </button>
              <div v-if="openDropdown === 'notifications'" class="absolute top-full right-[-60px] sm:right-0 mt-4 w-72 sm:w-80 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1 flex items-center justify-between">
                  <span>Notifications</span>
                  <span v-if="unreadNotificationCount > 0" class="text-[10px] text-[#165A31] font-bold">{{ unreadNotificationCount }} Unread</span>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div 
                    v-for="alert in topAlerts" 
                    :key="alert.id"
                    @click="handleAlertClick(alert)"
                    class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start justify-between cursor-pointer"
                    :class="{ 'bg-emerald-50/40': alert.status === 'Unread' || alert.read === 'No' }"
                  >
                    <div class="space-y-0.5 pr-2">
                      <div class="text-xs text-gray-800 font-semibold leading-tight line-clamp-1">{{ alert.title }}</div>
                      <div class="text-[11px] text-gray-500 leading-snug line-clamp-2">{{ alert.message }}</div>
                    </div>
                    <span class="text-[10px] text-gray-400 whitespace-nowrap ml-2 shrink-0">{{ alert.time }}</span>
                  </div>
                  <div v-if="topAlerts.length === 0" class="px-4 py-6 text-center text-xs text-gray-400">
                    No notifications
                  </div>
                </div>
                <button @click="openDropdown = null; router.push('/communication/notifications')" class="w-full text-left px-4 py-3 text-xs font-bold text-[#165A31] hover:bg-[#eefcf2] transition-colors flex items-center justify-between cursor-pointer">
                  View all notifications
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button class="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
              Theme
            </button>
            
            <!-- Profile -->
            <div class="relative ml-1">
              <button @click="toggleDropdown('profile')" class="w-8 h-8 rounded-full bg-[#165A31] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {{ isBranchUser ? 'BM' : userInitials }}
              </button>
              <div v-if="openDropdown === 'profile'" class="absolute top-full right-0 mt-3 w-52 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                <div class="px-4 py-2 border-b border-gray-50 mb-1">
                  <div class="text-[11px] font-bold text-gray-900">{{ isBranchUser ? 'Branch Manager' : (user.name || 'Super Admin') }}</div>
                  <div class="text-[9px] text-gray-400 font-medium">{{ user.branchName ? `${user.branchName} Branch` : 'All Branches' }} &middot; {{ user.role || 'Branch Manager' }}</div>
                </div>
                <button @click="openDropdown = null; router.push('/system/account')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Account</button>
                <button @click="openDropdown = null; router.push('/system/security')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Security & Sessions</button>
                <button @click="openDropdown = null; router.push('/system/preferences')" class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Preferences</button>
                <div class="border-t border-gray-50 mt-1 pt-1">
                  <button @click="handleLogout" class="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-semibold">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Mobile Sub-header for Search & Filters -->
      <div class="sm:hidden bg-white border-b border-gray-100 px-4 py-2 flex flex-col gap-2 z-20">
        <!-- Search -->
        <div class="relative w-full">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full pl-9 pr-4 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] focus:ring-1 focus:ring-[#165A31] transition-colors"
          />
        </div>
        
        <div class="flex items-center justify-between gap-2">
          <!-- Branch Dropdown Toggle (Simplified for Mobile) -->
          <button 
            @click="!isBranchUser && toggleDropdown('branch-mobile')" 
            class="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
          >
            <span class="truncate">{{ isBranchUser ? `${user.branchName} Branch` : selectedBranchScope }}</span>
            <Lock v-if="isBranchUser" class="w-3 h-3 text-[#165A31]" />
            <ChevronDown v-else class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </button>
          
          <!-- Date Dropdown Toggle (Simplified for Mobile) -->
          <button @click="toggleDropdown('date-mobile')" class="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <span class="truncate">This Month</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </button>
        </div>

        <!-- Mobile Dropdown Menus (Positioned absolutely over screen) -->
        <div v-if="openDropdown === 'branch-mobile' && !isBranchUser" class="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50">
          <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1">Branch Scope</div>
          <button 
            @click="selectBranchScope('All Branches')"
            class="w-full text-left px-4 py-2 text-xs flex items-center justify-between"
            :class="selectedBranchScope === 'All Branches' ? 'font-bold text-[#165A31] bg-[#eefcf2]' : 'text-gray-600 hover:bg-gray-50'"
          >
            All Branches
            <svg v-if="selectedBranchScope === 'All Branches'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
          <button 
            v-for="b in ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']"
            :key="b"
            @click="selectBranchScope(`${b} Branch`)"
            class="w-full text-left px-4 py-2 text-xs flex items-center justify-between"
            :class="selectedBranchScope === `${b} Branch` ? 'font-bold text-[#165A31] bg-[#eefcf2]' : 'text-gray-600 hover:bg-gray-50'"
          >
            {{ b }} Branch
            <svg v-if="selectedBranchScope === `${b} Branch`" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
        </div>

        <div v-if="openDropdown === 'date-mobile'" class="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50">
          <div class="px-4 py-2 text-[10px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 mb-1">Date Range</div>
          <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Today</button>
          <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">Last 7 days</button>
          <button class="w-full text-left px-4 py-2 text-xs font-bold text-[#165A31] bg-[#eefcf2] flex items-center justify-between">
            Last 30 days
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
          <button class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">This month</button>
        </div>
      </div>

      <!-- Page Content -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
