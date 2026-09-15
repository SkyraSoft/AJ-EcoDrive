<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const activeTab = ref('Overview')
const tabs = ['Overview', 'Contacts', 'Products', 'Purchase Orders', 'Receipts', 'Bills & Payments', 'Returns', 'Performance', 'Documents', 'Activity']

// Data for tabs
const contacts = [
  { name: 'Li Wei', role: 'Sales Director', email: 'sales@brgfactory.example', phone: '+86 188 0000 0000', primary: 'Yes' },
  { name: 'Chen Yu', role: 'Logistics', email: 'logistics@brgfactory.example', phone: '+86 188 0000 0101', primary: 'No' }
]

const suppliedProducts = [
  { product: 'BRG DS11', sku: 'BRG-DS11', lastCost: 'USD 505', leadTime: '25d', moq: '10', active: 'Yes' },
  { product: 'BRG EV-5', sku: 'BRG-EVS', lastCost: 'USD 580', leadTime: '25d', moq: '10', active: 'Yes' },
  { product: 'Cargo Pro', sku: 'BRG-CARGO', lastCost: 'USD 740', leadTime: '30d', moq: '6', active: 'Yes' }
]

const purchaseOrders = [
  { po: 'PO-2048', destination: 'Peshawar', amount: '2.8M', status: 'In Transit', eta: 'Aug 29' },
  { po: 'PO-2049', destination: 'All Branches', amount: '4.8M', status: 'Pending', eta: 'Sep 18' }
]

const receipts = [
  { receipt: 'GR-982', po: 'PO-1992', location: 'Peshawar', units: '20', discrepancy: '0', date: 'Jul 18' },
  { receipt: 'GR-974', po: 'PO-1961', location: 'Islamabad', units: '14', discrepancy: '1 shortage', date: 'Jul 02' }
]

const billsAndPayments = [
  { bill: 'BILL-771', po: 'PO-1992', amount: '3.0M', due: 'Aug 17', paid: '3.0M', outstanding: '0', match: 'Matched' },
  { bill: 'BILL-784', po: 'PO-2022', amount: '2.2M', due: 'Sep 10', paid: '0', outstanding: '2.2M', match: 'Open' }
]

const returns = [
  { return: 'PRTN-041', po: 'PO-1961', units: '1', reason: 'Transit damage', credit: '152K', status: 'Closed' }
]

const documents = [
  { document: 'Supplier Agreement.pdf', type: 'Contract', uploaded: 'Jan 05', expiry: 'Dec 31' },
  { document: 'Compliance Certificate.pdf', type: 'Compliance', uploaded: 'Feb 11', expiry: 'Feb 11, 2027' }
]

const activities = [
  { text: 'PO-2049 submitted for approval', date: 'Aug 27' },
  { text: 'Shipment update on PO-2048', date: 'Aug 26' },
  { text: 'Vendor bill BILL-784 received', date: 'Aug 24' }
]

const editSupplier = () => {
  store.originalEditSupplier = {
    name: 'BRG Factory',
    code: 'SUP-BRG-001',
    category: 'OEM / Bikes',
    status: 'Active',
    rating: '4.8',
    terms: 'Net 30',
    contact: 'Li Wei',
    phone: '+86 188 0000 0000',
    email: 'sales@brgfactory.example',
    address: 'Shenzhen, China',
    notes: 'Primary supplier for E-Bikes'
  }
  router.push('/procurement/suppliers/edit')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Suppliers / <span class="font-bold text-gray-800">Supplier Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Supplier Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">BRG Factory - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Main Card container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      
      <!-- Top Info Section -->
      <div class="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 mb-1">BRG Factory</h2>
          <div class="text-[11px] text-gray-500 font-medium">SUP-BRG-001 &middot; Shenzhen, China</div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
            Active
          </span>
          <button @click="editSupplier" class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Edit Supplier
          </button>
          <button class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
            More <span class="text-[8px]">▼</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-6 border-b border-gray-100 overflow-x-auto">
        <div class="flex items-center gap-6 min-w-max">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            class="pb-3 text-[11px] font-bold transition-colors relative"
            :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
          >
            {{ tab }}
            <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
          </button>
        </div>
      </div>

      <!-- Tab Content: Overview -->
      <div v-if="activeTab === 'Overview'" class="p-6 bg-[#fbfbfc] space-y-6">
        
        <!-- 4 Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Purchases YTD</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 38.4M</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Open POs</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">5</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Payable</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 4.2M</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">On-Time</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">92%</div>
          </div>
        </div>

        <!-- Supplier Summary Card -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Supplier Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Primary Contact</span>
              <span class="font-bold text-gray-900">Li Wei</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Terms</span>
              <span class="font-bold text-gray-900">30 days</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Lead Time</span>
              <span class="font-bold text-gray-900">25 days</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Currency</span>
              <span class="font-bold text-gray-900">USD</span>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Tab Content: Contacts -->
      <div v-else-if="activeTab === 'Contacts'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Contacts</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Name</th>
                  <th class="px-5 py-3">Role</th>
                  <th class="px-5 py-3">Email</th>
                  <th class="px-5 py-3">Phone</th>
                  <th class="px-5 py-3">Primary</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="contact in contacts" :key="contact.name" class="border-b border-gray-50">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ contact.name }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ contact.role }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ contact.email }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ contact.phone }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ contact.primary }}</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Products -->
      <div v-else-if="activeTab === 'Products'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Supplied Products</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Product</th>
                  <th class="px-5 py-3">SKU</th>
                  <th class="px-5 py-3">Last Cost</th>
                  <th class="px-5 py-3">Lead Time</th>
                  <th class="px-5 py-3">MOQ</th>
                  <th class="px-5 py-3">Active</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in suppliedProducts" :key="item.sku" class="border-b border-gray-50">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sku }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.lastCost }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.leadTime }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.moq }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.active }}</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Purchase Orders -->
      <div v-else-if="activeTab === 'Purchase Orders'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Purchase Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">PO</th>
                  <th class="px-5 py-3">Destination</th>
                  <th class="px-5 py-3">Amount</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">ETA</th>
                  <th class="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in purchaseOrders" :key="item.po" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.po }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.destination }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.amount }}</td>
                  <td class="px-5 py-4">
                    <span v-if="item.status === 'In Transit'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                    <span v-else-if="item.status === 'Pending'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                    <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.eta }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium hover:text-gray-900">Open &rarr;</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Receipts -->
      <div v-else-if="activeTab === 'Receipts'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Receipts</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Receipt</th>
                  <th class="px-5 py-3">PO</th>
                  <th class="px-5 py-3">Location</th>
                  <th class="px-5 py-3">Units</th>
                  <th class="px-5 py-3">Discrepancy</th>
                  <th class="px-5 py-3">Date</th>
                  <th class="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in receipts" :key="item.receipt" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.receipt }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.location }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.discrepancy }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.date }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium hover:text-gray-900">Open &rarr;</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Bills & Payments -->
      <div v-else-if="activeTab === 'Bills & Payments'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Bills & Payments</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Bill</th>
                  <th class="px-5 py-3">PO</th>
                  <th class="px-5 py-3">Amount</th>
                  <th class="px-5 py-3">Due</th>
                  <th class="px-5 py-3">Paid</th>
                  <th class="px-5 py-3">Outstanding</th>
                  <th class="px-5 py-3">Match</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in billsAndPayments" :key="item.bill" class="border-b border-gray-50">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.bill }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.amount }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.due }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.paid }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.outstanding }}</td>
                  <td class="px-5 py-4">
                    <span v-if="item.match === 'Matched'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.match }}</span>
                    <span v-else-if="item.match === 'Open'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.match }}</span>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
      
      <!-- Tab Content: Returns -->
      <div v-else-if="activeTab === 'Returns'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Purchase Returns</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Return</th>
                  <th class="px-5 py-3">PO</th>
                  <th class="px-5 py-3">Units</th>
                  <th class="px-5 py-3">Reason</th>
                  <th class="px-5 py-3">Credit</th>
                  <th class="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in returns" :key="item.return" class="border-b border-gray-50">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.return }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.credit }}</td>
                  <td class="px-5 py-4">
                    <span v-if="item.status === 'Closed'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Performance -->
      <div v-else-if="activeTab === 'Performance'" class="p-6 bg-[#fbfbfc] space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">On-Time</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">92%</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Quality Pass</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">97%</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Avg Lead Time</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">24.8d</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Discrepancy Rate</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">1.3%</div>
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Delivery Performance</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-wrap items-center gap-4">
              <div class="w-16 text-[11px] font-medium text-gray-600">On time</div>
              <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] rounded-full" style="width: 92%"></div>
              </div>
              <div class="text-[11px] font-bold text-gray-900 w-6 text-right">92</div>
            </div>
            <div class="flex flex-wrap items-center gap-4">
              <div class="w-16 text-[11px] font-medium text-gray-600">Quality</div>
              <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] rounded-full" style="width: 97%"></div>
              </div>
              <div class="text-[11px] font-bold text-gray-900 w-6 text-right">97</div>
            </div>
            <div class="flex flex-wrap items-center gap-4">
              <div class="w-16 text-[11px] font-medium text-gray-600">Complete</div>
              <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] rounded-full" style="width: 95%"></div>
              </div>
              <div class="text-[11px] font-bold text-gray-900 w-6 text-right">95</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Supplier Documents</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Document</th>
                  <th class="px-5 py-3">Type</th>
                  <th class="px-5 py-3">Uploaded</th>
                  <th class="px-5 py-3">Expiry</th>
                  <th class="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in documents" :key="item.document" class="border-b border-gray-50">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.document }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.uploaded }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expiry }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium hover:text-gray-900 cursor-pointer">Preview</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="p-6 bg-[#fbfbfc]">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Supplier Activity</h3>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="(item, i) in activities" :key="i" class="flex items-start gap-3">
              <div class="mt-1 w-1 h-3 rounded-full bg-[#165A31]"></div>
              <div class="flex-1 flex justify-between">
                <span class="text-[11px] font-bold text-gray-900">{{ item.text }}</span>
                <span class="text-[11px] font-medium text-gray-500">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder for other tabs -->
    </div>
  </div>
</template>
