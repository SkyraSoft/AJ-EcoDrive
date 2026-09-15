<script setup>
import { ref, onMounted, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '../../store.js'

const emit = defineEmits(['close'])

const saleData = ref({
  branch: 'Peshawar Branch',
  customer: 'Faisal Khan',
  salesperson: 'Hamza Ali',
  product: 'BRG DS11',
  selectedUnit: 'DS11-00997',
  cataloguePrice: '',
  discount: '',
  finalPrice: '',
  paymentMethod: 'Bank Transfer',
  amountReceived: '',
  balance: ''
})

const units = ref([
  { serial: 'DS11-01001', chassis: 'CH-90111', status: 'Available', statusColor: 'bg-[#eefcf2] text-[#165A31]', landedCost: '163.4K' },
  { serial: 'DS11-00997', chassis: 'CH-89991', status: 'Available', statusColor: 'bg-[#eefcf2] text-[#165A31]', landedCost: '145.8K' }
])

const showValidation = ref(false)
const isEditMode = computed(() => !!store.originalEditOrder)

onMounted(() => {
  if (store.originalEditOrder) {
    saleData.value = { ...saleData.value, ...store.originalEditOrder }
  }
})

const close = () => {
  store.originalEditOrder = null
  emit('close')
}

const createOrder = () => {
  if (!saleData.value.branch || !saleData.value.customer || !saleData.value.selectedUnit) {
    showValidation.value = true
    return
  }

  if (isEditMode.value) {
    store.applyEdit(store.originalEditOrder, saleData.value)
    store.originalEditOrder = null
  }
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            Super Admin / Sales & CRM / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Create a sale against an exact serialized unit, customer and payment record.</p>
        </div>

        <!-- 2-Column Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- 1. Sale Context Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Sale Context</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                  <input v-model="saleData.branch" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer</label>
                  <input v-model="saleData.customer" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Salesperson</label>
                  <input v-model="saleData.salesperson" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Product</label>
                  <input v-model="saleData.product" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- 2. Pricing Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Pricing</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Catalogue Price</label>
                  <input v-model="saleData.cataloguePrice" type="text" placeholder="e.g. PKR 240,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Discount</label>
                  <input v-model="saleData.discount" type="text" placeholder="e.g. PKR 10,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Final Price</label>
                  <input v-model="saleData.finalPrice" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- 3. Exact Unit Selection Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4 overflow-hidden">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Exact Unit Selection</h3>
              
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th class="px-4 py-3">Serial</th>
                      <th class="px-4 py-3">Chassis</th>
                      <th class="px-4 py-3 text-center">Status</th>
                      <th class="px-4 py-3 text-right">Landed Cost</th>
                      <th class="px-4 py-3 text-center">Select</th>
                    </tr>
                  </thead>
                  <tbody class="text-[11px]">
                    <tr v-for="unit in units" :key="unit.serial" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" @click="saleData.selectedUnit = unit.serial">
                      <td class="px-4 py-3.5 text-gray-900 font-semibold">{{ unit.serial }}</td>
                      <td class="px-4 py-3.5 text-gray-600 font-medium">{{ unit.chassis }}</td>
                      <td class="px-4 py-3.5 text-center">
                        <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', unit.statusColor]">
                          {{ unit.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3.5 text-right text-gray-600 font-medium">{{ unit.landedCost }}</td>
                      <td class="px-4 py-3.5 text-center">
                        <input type="radio" :value="unit.serial" v-model="saleData.selectedUnit" class="w-3.5 h-3.5 text-[#165A31] focus:ring-[#165A31] border-gray-300 cursor-pointer" @click.stop />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 4. Payment Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Payment</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Payment Method</label>
                  <input v-model="saleData.paymentMethod" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Amount Received</label>
                  <input v-model="saleData.amountReceived" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Balance</label>
                  <input v-model="saleData.balance" type="text" placeholder="PKR 0" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="createOrder" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Order' : 'Create Order & Reserve Unit' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
