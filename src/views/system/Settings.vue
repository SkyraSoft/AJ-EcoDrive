<script setup>
import { ref, computed } from 'vue'
import { CheckCircle2, ChevronRight, Info } from 'lucide-vue-next'

const activeTab = ref('Business Profile')

const tabs = [
  'Business Profile',
  'Branch Defaults',
  'Product Master Data',
  'Statuses',
  'Pricing Rules',
  'Payment Methods',
  'Expense Categories',
  'Approval Rules',
  'Numbering',
  'Notifications',
  'Data Import & Export',
  'Integrations',
  'Security'
]

const showToast = ref(false)
const toastMessage = ref('')

const tabDescriptions = {
  'Business Profile': 'Configure business profile.',
  'Branch Defaults': 'Configure branch defaults.',
  'Product Master Data': 'Configure product master data.',
  'Statuses': 'Configure statuses.',
  'Pricing Rules': 'Configure pricing rules.',
  'Payment Methods': 'Configure payment methods.',
  'Expense Categories': 'Configure expense categories.',
  'Approval Rules': 'Configure approval rules and limits.',
  'Numbering': 'Configure system numbering and prefix sequences.',
  'Notifications': 'Configure notification triggers and channels.',
  'Data Import & Export': 'Manage system data imports and export formats.',
  'Integrations': 'Configure integrations.',
  'Security': 'Configure security.'
}

// Form Data for various tabs
const businessProfile = ref({
  name: 'AJ EcoDrive Ltd',
  brand: 'BRG Electric Vehicles',
  timezone: 'Asia/Karachi',
  currency: 'PKR'
})

const branchDefaults = ref({
  openingHours: '09:00 AM - 06:00 PM',
  expenseLimit: 'PKR 100,000',
  discountLimit: '10%'
})

const productMasterData = ref({
  tracking: 'Serialized where applicable',
  skuFormat: 'BRG-[CAT]-[MODEL]-[YEAR]',
  warrantyDefault: '3-Year Battery & Controller'
})

const canonicalStatuses = [
  {
    entity: 'Product',
    statuses: 'Draft · Active · Archived'
  },
  {
    entity: 'PO',
    statuses: 'Draft · Pending Approval · Approved · Ordered · In Transit · Partially Received · Received · Closed · Cancelled'
  },
  {
    entity: 'Unit',
    statuses: 'Expected · Supplier In Transit · Receiving/QC · Available · Reserved · Transfer In Transit · Sold · Returned · In Service · Damaged/Quarantine · Scrapped'
  }
]

const pricingRules = ref({
  pricingMode: 'Fixed Selling Price · Cost + Markup',
  minMargin: '15%',
  discountThreshold: '8%'
})

const paymentMethods = ref([
  { method: 'Cash', active: 'Yes', requiresReference: 'No' },
  { method: 'Bank Transfer', active: 'Yes', requiresReference: 'Yes' },
  { method: 'Card', active: 'Yes', requiresReference: 'Yes' }
])

const expenseCategories = ref([
  { category: 'Salaries', active: 'Yes', approvalRule: 'Super Admin' },
  { category: 'Rent', active: 'Yes', approvalRule: 'Super Admin' },
  { category: 'Utilities', active: 'Yes', approvalRule: 'Within branch limit' },
  { category: 'Marketing', active: 'Yes', approvalRule: 'Threshold based' }
])

const approvalRules = ref([
  { workflow: 'Expense', branchLimit: '100K', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
  { workflow: 'Discount', branchLimit: '5%', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
  { workflow: 'Stock Adjustment', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' },
  { workflow: 'Refund', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' }
])

const numberingRecords = ref([
  { record: 'Order', prefix: 'SO-', next: '7741' },
  { record: 'Quotation', prefix: 'QT-', next: '1109' },
  { record: 'PO', prefix: 'PO-', next: '2050' },
  { record: 'Receipt', prefix: 'GR-', next: '992' }
])

const notificationRules = ref([
  { event: 'PO Approval Required', inApp: 'Yes', email: 'Yes', actionCentre: 'Yes' },
  { event: 'Low Stock', inApp: 'Yes', email: 'No', actionCentre: 'Critical only' },
  { event: 'Payment Posted', inApp: 'Yes', email: 'No', actionCentre: 'No' },
  { event: 'Security Login', inApp: 'Yes', email: 'Yes', actionCentre: 'No' }
])

const dataImportExport = ref([
  { item: 'Product Import', value: 'Controlled CSV' },
  { item: 'Opening Inventory', value: 'Super Admin only · audited' },
  { item: 'Export', value: 'Permission controlled' }
])

const integrations = ref([
  { integration: 'Email', purpose: 'Notifications', status: 'Connected' },
  { integration: 'WhatsApp', purpose: 'Customer communication', status: 'Planned' },
  { integration: 'Accounting Export', purpose: 'Operational finance export', status: 'Planned' }
])

const securitySettings = ref({
  mfaPolicy: 'Mandatory for Super Admin · Policy-enforceable for Branch Managers',
  sessionTimeout: '',
  passwordPolicy: ''
})

const saveSettings = () => {
  toastMessage.value = `${activeTab.value} settings saved successfully!`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumbs -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / System / Settings / <span class="font-bold text-gray-800">Settings — {{ activeTab }}</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Settings — {{ activeTab }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ tabDescriptions[activeTab] || 'Configure system settings.' }}</p>
    </div>

    <!-- System Settings Banner Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">System Settings</h2>
        <div class="text-xs text-gray-500 font-medium mt-0.5">
          Organisation-wide configuration
        </div>
      </div>

      <button 
        @click="saveSettings"
        class="bg-[#165A31] text-white text-[11px] font-bold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        Save Changes
      </button>
    </div>

    <!-- Scrollable Tab Navigation Bar -->
    <div class="border-b border-gray-200 overflow-x-auto">
      <div class="flex items-center gap-6 min-w-max pb-0.5">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="text-xs pb-3 font-semibold transition-all relative whitespace-nowrap cursor-pointer"
          :class="activeTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
        >
          {{ tab }}
          <div 
            v-if="activeTab === tab" 
            class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#165A31] rounded-full"
          ></div>
        </button>
      </div>
    </div>

    <!-- Tab Content Panels -->

    <!-- 1. Business Profile Tab -->
    <div v-if="activeTab === 'Business Profile'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Business Profile</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Business Name</label>
          <input 
            v-model="businessProfile.name"
            type="text" 
            placeholder="Enter business legal name..."
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Brand / Distribution</label>
          <input 
            v-model="businessProfile.brand"
            type="text" 
            placeholder="Enter primary brand or distribution..."
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Timezone</label>
          <input 
            v-model="businessProfile.timezone"
            type="text" 
            placeholder="Asia/Karachi"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Currency</label>
          <input 
            v-model="businessProfile.currency"
            type="text" 
            placeholder="PKR"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>
    </div>

    <!-- 2. Branch Defaults Tab -->
    <div v-if="activeTab === 'Branch Defaults'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Branch Defaults</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Opening Hours</label>
          <input 
            v-model="branchDefaults.openingHours"
            type="text" 
            placeholder="09:00 AM - 06:00 PM"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Expense Approval Limit</label>
          <input 
            v-model="branchDefaults.expenseLimit"
            type="text" 
            placeholder="PKR 100,000"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Max Branch Discount Allowance</label>
          <input 
            v-model="branchDefaults.discountLimit"
            type="text" 
            placeholder="10%"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>
    </div>

    <!-- 3. Product Master Data Tab -->
    <div v-if="activeTab === 'Product Master Data'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Product Master Data</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Inventory Tracking Method</label>
          <input 
            v-model="productMasterData.tracking"
            type="text" 
            placeholder="Serialized where applicable"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default SKU Pattern</label>
          <input 
            v-model="productMasterData.skuFormat"
            type="text" 
            placeholder="BRG-[CAT]-[MODEL]-[YEAR]"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Standard Default Warranty</label>
          <input 
            v-model="productMasterData.warrantyDefault"
            type="text" 
            placeholder="3-Year Battery & Controller"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <p class="text-[11px] text-gray-400 italic pt-1">
          Creating a product never creates stock.
        </p>
      </div>
    </div>

    <!-- 4. Statuses Tab -->
    <div v-if="activeTab === 'Statuses'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Canonical Statuses</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5 w-36">Entity</th>
              <th class="px-6 py-3.5">Statuses</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in canonicalStatuses" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-gray-900 w-36">{{ item.entity }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium leading-relaxed">{{ item.statuses }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5. Pricing Rules Tab -->
    <div v-if="activeTab === 'Pricing Rules'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Pricing Rules</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Pricing Strategy</label>
          <input 
            v-model="pricingRules.pricingMode"
            type="text" 
            placeholder="Fixed Selling Price · Cost + Markup"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Minimum Gross Margin Target</label>
          <input 
            v-model="pricingRules.minMargin"
            type="text" 
            placeholder="15%"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Manager Approval Discount Threshold</label>
          <input 
            v-model="pricingRules.discountThreshold"
            type="text" 
            placeholder="8%"
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>
    </div>

    <!-- 6. Payment Methods Tab -->
    <div v-if="activeTab === 'Payment Methods'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Payment Methods</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Method</th>
              <th class="px-6 py-3.5">Active</th>
              <th class="px-6 py-3.5">Requires Reference</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(pm, idx) in paymentMethods" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ pm.method }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ pm.active }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ pm.requiresReference }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 7. Expense Categories Tab -->
    <div v-if="activeTab === 'Expense Categories'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Expense Categories</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Category</th>
              <th class="px-6 py-3.5">Active</th>
              <th class="px-6 py-3.5">Approval Rule</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(exp, idx) in expenseCategories" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ exp.category }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ exp.active }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ exp.approvalRule }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 8. Approval Rules Tab -->
    <div v-if="activeTab === 'Approval Rules'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Approval Rules</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Workflow</th>
              <th class="px-6 py-3.5">Branch Limit</th>
              <th class="px-6 py-3.5">Above Limit</th>
              <th class="px-6 py-3.5">Super Admin</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(rule, idx) in approvalRules" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ rule.workflow }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.branchLimit }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.aboveLimit }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.superAdmin }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 9. Numbering Tab -->
    <div v-if="activeTab === 'Numbering'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Numbering</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Record</th>
              <th class="px-6 py-3.5">Prefix</th>
              <th class="px-6 py-3.5">Next</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(num, idx) in numberingRecords" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ num.record }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ num.prefix }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ num.next }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 10. Notifications Tab -->
    <div v-if="activeTab === 'Notifications'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Notification Rules</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Event</th>
              <th class="px-6 py-3.5">In-App</th>
              <th class="px-6 py-3.5">Email</th>
              <th class="px-6 py-3.5">Action Centre</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(rule, idx) in notificationRules" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ rule.event }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.inApp }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.email }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ rule.actionCentre }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 11. Data Import & Export Tab -->
    <div v-if="activeTab === 'Data Import & Export'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Data Import & Export</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div 
          v-for="(item, idx) in dataImportExport" 
          :key="idx"
          class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
        >
          <span class="text-xs font-medium text-gray-700">{{ item.item }}</span>
          <span class="text-xs font-bold text-gray-900">{{ item.value }}</span>
        </div>
      </div>
    </div>

    <!-- 12. Integrations Tab -->
    <div v-if="activeTab === 'Integrations'" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden animate-in fade-in duration-150">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Integrations</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Integration</th>
              <th class="px-6 py-3.5">Purpose</th>
              <th class="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, idx) in integrations" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.integration }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.purpose }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium text-right">{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 13. Security Tab -->
    <div v-if="activeTab === 'Security'" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Security Settings</h3>
      
      <div class="space-y-4 max-w-4xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">MFA Policy</label>
          <input 
            v-model="securitySettings.mfaPolicy"
            type="text" 
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Session Timeout</label>
          <input 
            v-model="securitySettings.sessionTimeout"
            type="text" 
            placeholder=""
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Password Policy</label>
          <input 
            v-model="securitySettings.passwordPolicy"
            type="text" 
            placeholder=""
            class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>
    </div>

  </div>
</template>
