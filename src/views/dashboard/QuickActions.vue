<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateQuotationModal from '../sales/CreateQuotation.vue'
import CreateStockRequestModal from '../inventory/CreateStockRequest.vue'
import CreateExpenseModal from '../finance/CreateExpense.vue'
import CreateCaseModal from '../after-sales/CreateCase.vue'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showQuotationModal = ref(false)
const showStockRequestModal = ref(false)
const showExpenseModal = ref(false)
const showCaseModal = ref(false)

const handleCreated = (type, payload) => {
  if (type === 'quotation') showQuotationModal.value = false
  if (type === 'stockRequest') showStockRequestModal.value = false
  if (type === 'expense') showExpenseModal.value = false
  if (type === 'case') showCaseModal.value = false
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Dashboard / <span class="font-medium text-gray-600">Quick Actions</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quick Actions</h1>
      <p class="text-xs text-gray-500 mt-1">Common branch actions.</p>
    </div>

    <!-- Quick Actions Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 max-w-xl">
      <h3 class="text-sm font-bold text-gray-900 mb-5">Quick Actions</h3>

      <div class="grid grid-cols-2 gap-3">
        <button 
          @click="showQuotationModal = true"
          class="bg-[#165A31] text-white text-xs font-bold py-3 px-4 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer text-center"
        >
          New Quotation
        </button>

        <button 
          @click="showStockRequestModal = true"
          class="bg-white border border-gray-200 text-gray-800 text-xs font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer text-center"
        >
          Request Stock
        </button>

        <button 
          @click="showExpenseModal = true"
          class="bg-white border border-gray-200 text-gray-800 text-xs font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer text-center"
        >
          Record Expense
        </button>

        <button 
          @click="showCaseModal = true"
          class="bg-white border border-gray-200 text-gray-800 text-xs font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer text-center"
        >
          Open Service Case
        </button>
      </div>
    </div>

    <!-- In-Context Quick Action Modals -->
    <CreateQuotationModal 
      v-if="showQuotationModal"
      @close="showQuotationModal = false"
      @created="handleCreated('quotation', $event)"
    />

    <CreateStockRequestModal 
      v-if="showStockRequestModal"
      @close="showStockRequestModal = false"
      @created="handleCreated('stockRequest', $event)"
    />

    <CreateExpenseModal 
      v-if="showExpenseModal"
      @close="showExpenseModal = false"
      @created="handleCreated('expense', $event)"
    />

    <CreateCaseModal 
      v-if="showCaseModal"
      @close="showCaseModal = false"
      @created="handleCreated('case', $event)"
    />
  </div>
</template>
