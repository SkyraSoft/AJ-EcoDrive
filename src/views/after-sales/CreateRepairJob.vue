<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Wrench, Plus, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  caseRef: 'WAR-442',
  customer: 'Faisal Khan',
  unit: 'EV5-00322',
  branch: 'Peshawar',
  diagnosis: 'Battery replacement',
  fault: 'Battery capacity below warranty threshold',
  decision: 'Replace battery',
  technician: 'Usman',
  partsName: 'Battery',
  partItem: '72V Battery Pack',
  partQty: 1,
  partCost: '68K',
  partSource: 'Service Stock',
  readyDate: 'Aug 30',
  status: 'Approved',
  tasks: [
    { name: 'Remove battery', tech: 'Usman' },
    { name: 'Install replacement', tech: 'Usman' },
    { name: 'Road test', tech: 'Usman' }
  ]
})

const newTaskName = ref('')
const addTask = () => {
  if (newTaskName.value.trim()) {
    form.value.tasks.push({
      name: newTaskName.value.trim(),
      tech: form.value.technician
    })
    newTaskName.value = ''
  }
}

const removeTask = (index) => {
  form.value.tasks.splice(index, 1)
}

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.back()
  }
}

const submitForm = () => {
  const newRepairId = `REP-${Math.floor(700 + Math.random() * 200)}`
  const newJob = {
    repairId: newRepairId,
    caseRef: form.value.caseRef || 'WAR-442',
    branch: form.value.branch,
    customer: form.value.customer,
    customerPhone: '+92 300 1234567',
    unit: form.value.unit,
    unitModel: `BRG ${form.value.unit}`,
    diagnosis: form.value.diagnosis,
    fault: form.value.fault,
    decision: form.value.decision,
    partsName: form.value.partsName,
    status: form.value.status,
    readyDate: form.value.readyDate || 'Aug 30',
    technician: form.value.technician,
    workPlan: form.value.tasks.map(t => ({
      task: t.name,
      technician: t.tech,
      status: 'Pending'
    })),
    partsList: [
      {
        part: form.value.partItem,
        qty: form.value.partQty,
        cost: form.value.partCost,
        source: form.value.partSource,
        status: 'Reserved'
      }
    ],
    labourList: [
      { work: form.value.diagnosis, hours: 1.5, rate: '2,500/hr', amount: '3,750' },
      { work: 'Road test & inspection', hours: 0.5, rate: '500/hr', amount: '250' }
    ],
    costSummary: {
      partsTotal: `PKR ${form.value.partCost}`,
      labourTotal: 'PKR 4,000',
      tax: 'PKR 0',
      total: `PKR ${form.value.partCost}`,
      warrantyCoverage: '100% Covered (OEM Claim)',
      customerPayable: 'PKR 0'
    },
    warrantyCoverage: {
      status: '100% OEM Warranty Claim',
      policy: 'Standard 3-Year Battery Warranty',
      approvalId: `OEM-CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      payable: 'PKR 0'
    },
    customerApproval: {
      status: 'Approved',
      approvedBy: form.value.customer,
      approvedDate: 'Just now',
      method: 'Digital Workshop Confirmation',
      notes: 'Customer approved repair work order.'
    },
    timeline: [
      { title: `Repair Job ${newRepairId} Created`, time: 'Just now', actor: `${form.value.branch} Workshop` }
    ]
  }

  store.addRepairJob(newJob)
  emit('created', newJob)
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div class="space-y-6">
          
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">
                Super Admin / After-sales / Repair Jobs / <span class="font-bold text-gray-800">Create Repair Job</span>
              </div>
              <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">Create Repair Job</h1>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">Initiate a workshop repair job with parts allocation, labour and technician tasks.</p>
            </div>
          </div>

          <!-- Form Grid (4 Cards) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Unit & Case Reference -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">1. Case & Customer Reference</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Case Reference (WAR / SRV)</label>
                  <input 
                    v-model="form.caseRef" 
                    type="text" 
                    placeholder="e.g. WAR-442" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Customer Name</label>
                  <input 
                    v-model="form.customer" 
                    type="text" 
                    required
                    placeholder="Enter customer name..." 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Unit Serial</label>
                    <input 
                      v-model="form.unit" 
                      type="text" 
                      required
                      placeholder="e.g. EV5-00322" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch</label>
                    <select 
                      v-model="form.branch" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                    >
                      <option value="Peshawar">Peshawar</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 2. Diagnosis & Work Decision -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">2. Diagnosis & Decision</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Diagnosis Category</label>
                  <input 
                    v-model="form.diagnosis" 
                    type="text" 
                    required
                    placeholder="e.g. Battery replacement, Controller fault" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Fault Details</label>
                  <input 
                    v-model="form.fault" 
                    type="text" 
                    placeholder="e.g. Battery capacity below warranty threshold" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Decision</label>
                    <input 
                      v-model="form.decision" 
                      type="text" 
                      placeholder="e.g. Replace battery" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Lead Technician</label>
                    <input 
                      v-model="form.technician" 
                      type="text" 
                      placeholder="e.g. Usman" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                </div>
              </div>

              <!-- 3. Parts Allocation -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">3. Parts & Materials</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Required Part Name</label>
                  <input 
                    v-model="form.partItem" 
                    type="text" 
                    placeholder="e.g. 72V Battery Pack" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Qty</label>
                    <input 
                      v-model="form.partQty" 
                      type="number" 
                      min="1"
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Cost</label>
                    <input 
                      v-model="form.partCost" 
                      type="text" 
                      placeholder="68K" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Source</label>
                    <select 
                      v-model="form.partSource" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                    >
                      <option value="Service Stock">Service Stock</option>
                      <option value="Central Warehouse">Central WH</option>
                      <option value="OEM Supplier">OEM Supplier</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 4. Work Tasks & Status -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">4. Work Plan & Schedule</h3>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Target Completion Date</label>
                    <input 
                      v-model="form.readyDate" 
                      type="text" 
                      placeholder="e.g. Aug 30" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Job Status</label>
                    <select 
                      v-model="form.status" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                    >
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Parts Waiting">Parts Waiting</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Technician Tasks</label>
                  <div class="space-y-1.5 mb-2">
                    <div 
                      v-for="(t, idx) in form.tasks" 
                      :key="idx" 
                      class="flex items-center justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100"
                    >
                      <span class="font-medium text-gray-800">{{ t.name }} ({{ t.tech }})</span>
                      <button type="button" @click="removeTask(idx)" class="text-gray-400 hover:text-red-500">
                        <X class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <input 
                      v-model="newTaskName" 
                      type="text" 
                      placeholder="Add new task..." 
                      class="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31]"
                      @keyup.enter.prevent="addTask"
                    />
                    <button 
                      type="button" 
                      @click="addTask" 
                      class="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="close" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                Create Repair Job
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
