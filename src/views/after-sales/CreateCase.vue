<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { UploadCloud, Image as ImageIcon, X } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  customer: 'Faisal Khan',
  unit: 'EV5-00322 - BRG EV-5',
  branch: 'Peshawar',
  type: 'Warranty',
  issue: 'Battery range reduced',
  priority: 'High',
  eligibility: 'Active (Under Warranty)',
  batteryCoverage: 'Standard 3-Year Battery Warranty',
  notes: 'Range dropped after recent charge cycles.'
})

const uploadedPhotos = ref([
  { name: 'odometer_cluster.jpg', size: '1.2 MB' },
  { name: 'battery_label.jpg', size: '2.4 MB' }
])

const handleFileUpload = (e) => {
  const files = e.target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      uploadedPhotos.value.push({
        name: files[i].name,
        size: `${(files[i].size / (1024 * 1024)).toFixed(1)} MB`
      })
    }
  }
}

const removePhoto = (index) => {
  uploadedPhotos.value.splice(index, 1)
}

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.back()
  }
}

const submitForm = () => {
  const newId = `WAR-${Math.floor(100 + Math.random() * 900)}`
  const newCase = {
    caseId: newId,
    branch: form.value.branch,
    customer: form.value.customer,
    customerPhone: '+92 300 1234567',
    customerEmail: `${form.value.customer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    customerAddress: `${form.value.branch} Main Hub Region`,
    unit: form.value.unit,
    unitSerial: form.value.unit.split(' ')[0] || 'EV5-00999',
    unitModel: form.value.unit,
    vin: `BRG-${form.value.unit.split(' ')[0] || 'EV5'}-2025`,
    motorNo: 'MOT-72V-3000W-NEW',
    batterySerial: 'BAT-72V-50AH-CUSTOM',
    odometer: '3,200 km',
    purchaseDate: 'Feb 15, 2025',
    warrantyStart: 'Feb 15, 2025',
    warrantyEnd: 'Feb 15, 2028',
    type: form.value.type,
    opened: 'Just now',
    warranty: form.value.eligibility.includes('Active') ? 'Active' : 'Paid',
    status: 'Diagnosis',
    age: '0d',
    priority: form.value.priority,
    eligibility: form.value.eligibility,
    batteryCoverage: form.value.batteryCoverage,
    issue: form.value.issue || 'Customer reported diagnostic request',
    notes: form.value.notes,
    owner: `${form.value.branch} Service Team`,
    assignedTech: 'Pending Assignment',
    diagnosisSummary: 'Case initiated. Pending hardware scan and diagnostic intake inspection.',
    estimatedCompletion: '3 days',
    totalCost: form.value.type === 'Warranty' ? 'PKR 0 (Warranty)' : 'PKR 4,500',
    coveredByWarranty: form.value.type === 'Warranty' ? '100% covered' : '0%',
    customerPayable: form.value.type === 'Warranty' ? 'PKR 0' : 'PKR 4,500'
  }

  store.addCase(newCase)
  emit('created', newCase)
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
                Super Admin / After-sales / Warranty & Service / <span class="font-bold text-gray-800">Create Warranty / Service Case</span>
              </div>
              <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">Create Warranty / Service Case</h1>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">Create a case against an exact customer-owned unit.</p>
            </div>
          </div>

          <!-- Form Grid (4 Cards) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Customer & Unit -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Customer & Unit</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Customer</label>
                  <input 
                    v-model="form.customer" 
                    type="text" 
                    placeholder="Enter customer name..." 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Unit</label>
                  <input 
                    v-model="form.unit" 
                    type="text" 
                    placeholder="e.g. EV5-00322 - BRG EV-5" 
                    required
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

              <!-- 2. Case Details -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Case</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Type</label>
                  <select 
                    v-model="form.type" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Warranty">Warranty</option>
                    <option value="Service">Service</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Issue</label>
                  <input 
                    v-model="form.issue" 
                    type="text" 
                    placeholder="Describe issue (e.g. Battery range reduced)" 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Priority</label>
                  <select 
                    v-model="form.priority" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <!-- 3. Warranty -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Warranty</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Eligibility</label>
                  <input 
                    v-model="form.eligibility" 
                    type="text" 
                    placeholder="Active / Out of Warranty / Under Review" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Battery Coverage</label>
                  <input 
                    v-model="form.batteryCoverage" 
                    type="text" 
                    placeholder="e.g. Standard 3-Year Battery Warranty" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
              </div>

              <!-- 4. Evidence -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Evidence</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Photos</label>
                  <div class="relative">
                    <label class="border-2 border-dashed border-gray-200 hover:border-[#165A31] rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 group">
                      <UploadCloud class="w-5 h-5 text-gray-400 group-hover:text-[#165A31] transition-colors mb-1" />
                      <span class="text-[11px] font-medium text-gray-600">Click to upload or drag & drop</span>
                      <span class="text-[9px] text-gray-400">PNG, JPG up to 10MB</span>
                      <input type="file" multiple accept="image/*" class="hidden" @change="handleFileUpload" />
                    </label>
                  </div>

                  <!-- Uploaded previews -->
                  <div v-if="uploadedPhotos.length > 0" class="mt-2 space-y-1.5">
                    <div v-for="(photo, idx) in uploadedPhotos" :key="idx" class="flex items-center justify-between text-[10px] bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                      <div class="flex items-center gap-1.5 text-gray-700 truncate">
                        <ImageIcon class="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span class="truncate">{{ photo.name }}</span>
                        <span class="text-gray-400">({{ photo.size }})</span>
                      </div>
                      <button type="button" @click="removePhoto(idx)" class="text-gray-400 hover:text-red-500">
                        <X class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Customer Notes</label>
                  <textarea 
                    v-model="form.notes" 
                    rows="3" 
                    placeholder="Customer notes and specific symptoms described..."
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] resize-none"
                  ></textarea>
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="close" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                Create Case
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
