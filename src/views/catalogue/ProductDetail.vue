<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, Clock, AlertCircle } from 'lucide-vue-next'
import { store } from '../../store.js'

const router = useRouter()
const currentTab = ref('Overview')
const tabs = [
  'Overview', 'Specifications', 'Variants', 'Pricing', 
  'Stock by Branch', 'Serialized Units', 'Procurement', 'Sales', 
  'Warranty', 'Media & Documents', 'Audit'
]

// Overview Data
const overviewKpis = [
  { label: 'Selling Price', value: 'PKR 185K' },
  { label: 'Total Stock', value: '36' },
  { label: 'Available', value: '24' },
  { label: 'Incoming', value: '5' }
]

const summaryData = [
  { label: 'Model', value: 'DS11' },
  { label: 'Tracking', value: 'Serial + Chassis' },
  { label: 'Warranty', value: '24 months' },
  { label: 'Reorder Level', value: '8' }
]

const availabilityData = [
  { branch: 'Peshawar', stock: 24, percent: '100%' },
  { branch: 'Islamabad', stock: 7, percent: '29%' },
  { branch: 'Lahore', stock: 3, percent: '12%' },
  { branch: 'Rawalpindi', stock: 2, percent: '8%' }
]

// Specifications Data
const specsData = [
  { spec: 'Motor', value: '1000W BLDC' },
  { spec: 'Battery', value: '72V / 32Ah' },
  { spec: 'Range', value: '85 km' },
  { spec: 'Top Speed', value: '52 km/h' },
  { spec: 'Charging Time', value: '6-8 hours' },
  { spec: 'Tyres', value: 'Tubeless' }
]

// Variants Data
const variantsData = [
  { variant: 'Black', code: 'DS11-BLK', price: '185K', active: 'Yes', stock: 19 },
  { variant: 'White', code: 'DS11-WHT', price: '185K', active: 'Yes', stock: 11 },
  { variant: 'Red', code: 'DS11-RED', price: '185K', active: 'Yes', stock: 6 }
]

// Pricing Data
const pricingKpis = [
  { label: 'Current Price', value: 'PKR 185K' },
  { label: 'Reference Landed Cost', value: 'PKR 146K' },
  { label: 'Markup', value: '26.7%' },
  { label: 'Gross Margin', value: '21.1%' }
]

const priceHistoryData = [
  { effective: 'Aug 01', price: '185K', reason: 'Market update', changedBy: 'Super Admin' },
  { effective: 'May 15', price: '179K', reason: 'Launch adjustment', changedBy: 'Super Admin' }
]

// Stock by Branch Data
const stockByBranchData = [
  { branch: 'Peshawar', available: '24', reserved: '6', incoming: '5', qc: '1', total: '36', value: '4.2M' },
  { branch: 'Islamabad', available: '7', reserved: '2', incoming: '2', qc: '0', total: '11', value: '1.5M' },
  { branch: 'Lahore', available: '3', reserved: '1', incoming: '0', qc: '0', total: '4', value: '0.6M' }
]

// Serialized Units Data
const serializedUnitsData = [
  { serial: 'DS11-00990', chassis: 'CH-99201', branch: 'Peshawar', status: 'Available', cost: '146K', customer: '—' },
  { serial: 'DS11-00991', chassis: 'CH-99194', branch: 'Peshawar', status: 'Reserved', cost: '146K', customer: 'Faisal Khan' },
  { serial: 'DS11-00999', chassis: 'CH-99165', branch: 'Islamabad', status: 'Sold', cost: '146K', customer: 'Saad Ahmad' }
]

// Procurement Data
const procurementData = [
  { po: 'PO-2048', supplier: 'BRG Factory', qty: '8', received: '0', cost: '—', date: 'Aug 29 ETA' },
  { po: 'PO-1992', supplier: 'BRG Factory', qty: '20', received: '20', cost: '145.5K', date: 'Jul 19' }
]

// Sales Data
const salesKpis = [
  { label: 'Units Sold', value: '184 YTD' },
  { label: 'Revenue', value: 'PKR 33.1M' },
  { label: 'Avg Price', value: 'PKR 180K' },
  { label: 'Return Rate', value: '1.6%' }
]

const salesData = [
  { order: 'SO-7721', branch: 'Islamabad', unit: 'DS11-00999', customer: 'Saad Ahmad', price: '185K', date: 'Aug 27' },
  { order: 'SO-7722', branch: 'Peshawar', unit: 'DS11-00994', customer: 'Faisal Khan', price: '182K', date: 'Aug 26' }
]

// Warranty Data
const warrantyData = [
  { label: 'Coverage', value: '24 months' },
  { label: 'Battery', value: '12 months' },
  { label: 'Open Cases', value: '3' },
  { label: 'Resolved YTD', value: '28' }
]

// Media & Documents Data
const mediaData = [
  { file: 'DS11_Main.jpg', type: 'Image', usage: 'Primary product image', updated: 'Aug 12' },
  { file: 'DS11_Side.jpg', type: 'Image', usage: 'Gallery', updated: 'Aug 12' },
  { file: 'DS11_Specsheet.pdf', type: 'PDF', usage: 'Technical', updated: 'Jul 04' }
]

// Audit Data
const auditData = [
  { action: 'Selling price updated to PKR 185K', date: 'Aug 01' },
  { action: 'Red variant activated', date: 'Jul 12' },
  { action: 'Warranty rule updated', date: 'Jun 18' }
]

const editProduct = () => {
  store.originalEditProduct = {
    name: 'BRG DS11',
    sku: 'BRG-DS11',
    category: 'Electric Bikes',
    subcategory: 'Commuter',
    model: '2025',
    tracking: 'Serialized',
    variants: 'Red, Blue',
    warranty: '1 Year',
    motor: '1000W',
    battery: '72V 20Ah',
    range: '80km',
    speed: '60km/h',
    price: 'PKR 185K',
    reorderLevel: '10',
    documents: 'User Manual',
    activation: 'Active',
    total: '30',
    available: '24',
    reserved: '6',
    incoming: '5',
    lowStock: false,
    status: 'Active'
  }
  router.push('/catalogue/products/edit')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <!-- Header -->
    <div class="mb-6">
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Catalogue / Products / <span class="font-bold text-gray-800">Product Detail — {{ currentTab }}</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Detail — {{ currentTab }}</h1>
      <p class="text-sm text-gray-500 mt-1">BRG DS11 · {{ currentTab }}</p>
    </div>

    <!-- Product Detail Card & Tabs Area -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden mb-6">
      <!-- Card Header -->
      <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 mb-1">BRG DS11</h2>
          <div class="text-[11px] text-gray-500 font-medium">SKU BRG-DS11 · Electric Bikes · Serialized</div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
            Active
          </span>
          <button @click="editProduct" class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Edit Product
          </button>
          <button class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
            More <span class="text-[8px]">▼</span>
          </button>
        </div>
      </div>
      
      <!-- Tabs Navigation -->
      <div class="px-6 flex items-center gap-6 overflow-x-auto border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="currentTab = tab"
          class="py-4 text-[11px] font-bold whitespace-nowrap transition-colors relative"
          :class="currentTab === tab ? 'text-[#165A31]' : 'text-gray-500 hover:text-gray-900'"
        >
          {{ tab }}
          <div v-if="currentTab === tab" class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#165A31] rounded-t-full"></div>
        </button>
      </div>
    </div>

    <!-- TAB CONTENTS -->

    <!-- Overview Tab -->
    <div v-if="currentTab === 'Overview'" class="space-y-6">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(kpi, index) in overviewKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
          <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Summary -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Product Summary</h3>
          <div class="space-y-4">
            <div v-for="item in summaryData" :key="item.label" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">{{ item.label }}</span>
              <span class="font-bold text-gray-900">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Availability</h3>
          <div class="space-y-4">
            <div v-for="item in availabilityData" :key="item.branch" class="flex items-center text-[10px]">
              <span class="font-medium text-gray-500 w-24">{{ item.branch }}</span>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] rounded-full" :style="{ width: item.percent }"></div>
              </div>
              <span class="font-bold text-gray-900 w-6 text-right">{{ item.stock }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Specifications Tab -->
    <div v-else-if="currentTab === 'Specifications'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Technical Specifications</h3>
        </div>
        <div class="w-full overflow-x-auto"><table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-6 py-3 w-1/3">Specification</th>
              <th class="px-6 py-3">Value</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="spec in specsData" :key="spec.spec" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ spec.spec }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ spec.value }}</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>

    <!-- Variants Tab -->
    <div v-else-if="currentTab === 'Variants'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Variants</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">Variant</th>
                <th class="px-6 py-3">Code</th>
                <th class="px-6 py-3">Selling Price</th>
                <th class="px-6 py-3">Active</th>
                <th class="px-6 py-3">Stock</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="variant in variantsData" :key="variant.code" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ variant.variant }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ variant.code }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ variant.price }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ variant.active }}</td>
                <td class="px-6 py-4 font-bold text-gray-900">{{ variant.stock }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Pricing Tab -->
    <div v-else-if="currentTab === 'Pricing'" class="space-y-6">
      <!-- Pricing KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(kpi, index) in pricingKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
          <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
        </div>
      </div>

      <!-- Price History -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Price History</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">Effective</th>
                <th class="px-6 py-3">Price</th>
                <th class="px-6 py-3">Reason</th>
                <th class="px-6 py-3">Changed By</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="history in priceHistoryData" :key="history.effective" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ history.effective }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ history.price }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ history.reason }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ history.changedBy }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
    
    <!-- Stock by Branch Tab -->
    <div v-else-if="currentTab === 'Stock by Branch'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Branch Stock</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">Branch</th>
                <th class="px-6 py-3">Available</th>
                <th class="px-6 py-3">Reserved</th>
                <th class="px-6 py-3">Incoming</th>
                <th class="px-6 py-3">QC</th>
                <th class="px-6 py-3">Total</th>
                <th class="px-6 py-3">Value</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="stock in stockByBranchData" :key="stock.branch" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ stock.branch }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ stock.available }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ stock.reserved }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ stock.incoming }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ stock.qc }}</td>
                <td class="px-6 py-4 font-bold text-gray-900">{{ stock.total }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ stock.value }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Serialized Units Tab -->
    <div v-else-if="currentTab === 'Serialized Units'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Units</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">Serial</th>
                <th class="px-6 py-3">Chassis</th>
                <th class="px-6 py-3">Branch</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Landed Cost</th>
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="unit in serializedUnitsData" :key="unit.serial" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-gray-600 font-medium">{{ unit.serial }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ unit.chassis }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ unit.branch }}</td>
                <td class="px-6 py-4">
                  <span v-if="unit.status === 'Available'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#eefcf2] text-[#165A31]">{{ unit.status }}</span>
                  <span v-else-if="unit.status === 'Reserved'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-amber-50 text-amber-600">{{ unit.status }}</span>
                  <span v-else-if="unit.status === 'Sold'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-blue-50 text-blue-600">{{ unit.status }}</span>
                </td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ unit.cost }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ unit.customer }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium cursor-pointer hover:text-gray-900">Open &rarr;</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Procurement Tab -->
    <div v-else-if="currentTab === 'Procurement'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Procurement History</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">PO</th>
                <th class="px-6 py-3">Supplier</th>
                <th class="px-6 py-3">Qty</th>
                <th class="px-6 py-3">Received</th>
                <th class="px-6 py-3">Avg Landed Cost</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="proc in procurementData" :key="proc.po" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.po }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.supplier }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.qty }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.received }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.cost }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ proc.date }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium cursor-pointer hover:text-gray-900">Open &rarr;</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Sales Tab -->
    <div v-else-if="currentTab === 'Sales'" class="space-y-6">
      <!-- Sales KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(kpi, index) in salesKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
          <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Recent Sales</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">Order</th>
                <th class="px-6 py-3">Branch</th>
                <th class="px-6 py-3">Unit</th>
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Price</th>
                <th class="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="sale in salesData" :key="sale.order" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.order }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.branch }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.unit }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.customer }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.price }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ sale.date }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
    
    <!-- Warranty Tab -->
    <div v-else-if="currentTab === 'Warranty'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Warranty Rules & Cases</h3>
        <div class="space-y-4">
          <div v-for="item in warrantyData" :key="item.label" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="font-medium text-gray-500">{{ item.label }}</span>
            <span class="font-bold text-gray-900">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Media & Documents Tab -->
    <div v-else-if="currentTab === 'Media & Documents'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Media & Documents</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-6 py-3">File</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3">Usage</th>
                <th class="px-6 py-3 text-right">Updated</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="media in mediaData" :key="media.file" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ media.file }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ media.type }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ media.usage }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium text-right">{{ media.updated }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Audit Tab -->
    <div v-else-if="currentTab === 'Audit'">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Product Audit</h3>
        <div class="space-y-4">
          <div v-for="audit in auditData" :key="audit.action" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px] pl-3 border-l-2 border-[#165A31]">
            <span class="font-bold text-gray-900">{{ audit.action }}</span>
            <span class="font-medium text-gray-500">{{ audit.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State for Unimplemented Tabs -->
    <div v-else class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-12 text-center">
      <h3 class="text-sm font-bold text-gray-900 mb-1">{{ currentTab }} Data</h3>
      <p class="text-xs text-gray-500">This section is not implemented in the current prototype.</p>
    </div>

  </div>
</template>
