<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingCart, FilePlus, UserPlus, Tag, Receipt, 
  Package, Truck, DollarSign, Wrench, CheckCircle2, Plus, Sparkles 
} from 'lucide-vue-next'
import { store } from '../../store.js'

import CreateSaleModal from '../sales/CreateSale.vue'
import CreateLeadModal from '../sales/CreateLead.vue'
import CreateQuotationModal from '../sales/CreateQuotation.vue'
import CreatePaymentModal from '../sales/CreatePayment.vue'
import CreateCustomerModal from '../sales/CreateCustomer.vue'
import CreateExpenseModal from '../finance/CreateExpense.vue'
import CreateStockRequestModal from '../inventory/CreateStockRequest.vue'
import CreateTransferModal from '../inventory/CreateTransfer.vue'
import CreateCaseModal from '../after-sales/CreateCase.vue'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showSaleModal = ref(false)
const saleModalMode = ref('sale')
const showLeadModal = ref(false)
const showQuotationModal = ref(false)
const showPaymentModal = ref(false)
const showCustomerModal = ref(false)
const showExpenseModal = ref(false)
const showStockRequestModal = ref(false)
const showTransferModal = ref(false)
const showCaseModal = ref(false)

const showToast = ref(false)
const toastMessage = ref('')
const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const openModal = (type) => {
  if (type === 'quickSale') {
    saleModalMode.value = 'sale'
    showSaleModal.value = true
  } else if (type === 'newOrder') {
    saleModalMode.value = 'order'
    showSaleModal.value = true
  } else if (type === 'lead') {
    showLeadModal.value = true
  } else if (type === 'quotation') {
    showQuotationModal.value = true
  } else if (type === 'payment') {
    showPaymentModal.value = true
  } else if (type === 'customer') {
    showCustomerModal.value = true
  } else if (type === 'expense') {
    showExpenseModal.value = true
  } else if (type === 'stockRequest') {
    showStockRequestModal.value = true
  } else if (type === 'transfer') {
    showTransferModal.value = true
  } else if (type === 'case') {
    showCaseModal.value = true
  }
}

const handleCreated = (type, payload) => {
  if (type === 'sale') showSaleModal.value = false
  if (type === 'lead') showLeadModal.value = false
  if (type === 'quotation') showQuotationModal.value = false
  if (type === 'payment') showPaymentModal.value = false
  if (type === 'customer') showCustomerModal.value = false
  if (type === 'expense') showExpenseModal.value = false
  if (type === 'stockRequest') showStockRequestModal.value = false
  if (type === 'transfer') showTransferModal.value = false
  if (type === 'case') showCaseModal.value = false

  const titles = {
    'sale': 'Point of Sale (POS) completed & invoice generated',
    'order': 'Sales order booking created & VIN reserved',
    'lead': 'New walk-in lead registered',
    'quotation': 'Formal quotation created',
    'payment': 'Customer payment recorded & invoice updated',
    'customer': 'Customer registered with CNIC',
    'expense': 'Showroom expense voucher recorded',
    'stockRequest': 'Stock replenishment request submitted',
    'transfer': 'Inter-branch stock transfer initiated',
    'case': 'Service intake case registered'
  }
  triggerToast(titles[type] || 'Action completed successfully')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Dashboard / <span class="font-medium text-gray-600">Quick Actions</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Showroom Quick Actions</h1>
      <p class="text-xs text-gray-500 mt-1">1-click direct operational launchers for {{ user.branchName || 'Showroom' }} floor workflows.</p>
    </div>

    <!-- Quick Action Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Section 1: Sales & Commercial Workflows -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Commercial & Sales Actions</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Floor sales, customer bookings, leads, quotes, and payment collections.</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#165A31]">5 Actions</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Quick Sale (POS) -->
          <button 
            @click="openModal('quickSale')"
            class="bg-[#165A31] text-white p-3.5 rounded-xl hover:bg-[#124a28] transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold flex items-center gap-1.5">
                <ShoppingCart class="w-4 h-4 text-emerald-300" /> Point of Sale (POS)
              </span>
              <span class="text-[9px] px-1.5 py-0.5 bg-emerald-700/60 rounded font-bold uppercase tracking-wider">Instant</span>
            </div>
            <p class="text-[10px] text-emerald-100/90 leading-tight">Immediate walk-in sale on available stock with instant VIN assignment.</p>
          </button>

          <!-- New Order (Booking) -->
          <button 
            @click="openModal('newOrder')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <FilePlus class="w-4 h-4 text-blue-600" /> New Sales Order
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Advance vehicle booking, custom allocation, or deposit reservation.</p>
          </button>

          <!-- New Lead -->
          <button 
            @click="openModal('lead')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <UserPlus class="w-4 h-4 text-purple-600" /> New Walk-In Lead
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Capture visitor contact info, model interest, and test ride preference.</p>
          </button>

          <!-- New Quotation -->
          <button 
            @click="openModal('quotation')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <Tag class="w-4 h-4 text-amber-600" /> New Quotation
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Prepare formal 7-day binding customer price quote with specs.</p>
          </button>

          <!-- Record Payment -->
          <button 
            @click="openModal('payment')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between sm:col-span-2 group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <Receipt class="w-4 h-4 text-emerald-600" /> Record Customer Payment
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Post cash drawer collection, IBFT bank transfer, or customer cheque.</p>
          </button>
        </div>
      </div>

      <!-- Section 2: Showroom & After-Sales Operations -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Showroom Operations & Workshop</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Inventory requisitions, stock movements, expenses, and repairs.</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">4 Actions</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Stock Request -->
          <button 
            @click="openModal('stockRequest')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <Package class="w-4 h-4 text-indigo-600" /> Request Stock (Replenishment)
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Request vehicle models from Central Warehouse when below reorder limit.</p>
          </button>

          <!-- Inter-Branch Transfer -->
          <button 
            @click="openModal('transfer')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <Truck class="w-4 h-4 text-teal-600" /> Inter-Branch Transfer
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Dispatch physical serialized bikes to another city dealership showroom.</p>
          </button>

          <!-- Log Expense -->
          <button 
            @click="openModal('expense')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <DollarSign class="w-4 h-4 text-rose-600" /> Log Showroom Expense
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Record petty cash expenditure (utilities, cleaning, tea, emergency repairs).</p>
          </button>

          <!-- Service Intake -->
          <button 
            @click="openModal('case')"
            class="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-xl hover:border-[#165A31]/40 hover:bg-emerald-50/20 transition-all shadow-sm cursor-pointer text-left flex flex-col justify-between group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-[#165A31]">
                <Wrench class="w-4 h-4 text-amber-600" /> Open Service Case
              </span>
            </div>
            <p class="text-[10px] text-gray-500 leading-tight">Log customer bike intake, recorded odometer, OBD diagnostic, and warranty.</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[150] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- In-Context Quick Action Modals -->
    <CreateSaleModal 
      v-if="showSaleModal"
      :mode="saleModalMode"
      @close="showSaleModal = false"
      @created="handleCreated('sale', $event)"
    />

    <CreateLeadModal 
      v-if="showLeadModal"
      @close="showLeadModal = false"
      @created="handleCreated('lead', $event)"
    />

    <CreateQuotationModal 
      v-if="showQuotationModal"
      @close="showQuotationModal = false"
      @created="handleCreated('quotation', $event)"
    />

    <CreatePaymentModal 
      v-if="showPaymentModal"
      @close="showPaymentModal = false"
      @created="handleCreated('payment', $event)"
    />

    <CreateCustomerModal 
      v-if="showCustomerModal"
      @close="showCustomerModal = false"
      @created="handleCreated('customer', $event)"
    />

    <CreateExpenseModal 
      v-if="showExpenseModal"
      @close="showExpenseModal = false"
      @created="handleCreated('expense', $event)"
    />

    <CreateStockRequestModal 
      v-if="showStockRequestModal"
      @close="showStockRequestModal = false"
      @created="handleCreated('stockRequest', $event)"
    />

    <CreateTransferModal 
      v-if="showTransferModal"
      @close="showTransferModal = false"
      @created="handleCreated('transfer', $event)"
    />

    <CreateCaseModal 
      v-if="showCaseModal"
      @close="showCaseModal = false"
      @created="handleCreated('case', $event)"
    />
  </div>
</template>
