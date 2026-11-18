<script setup>
import { ref, computed, watch } from 'vue'
import { Calendar, ChevronDown, Check, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '30d'
  },
  customStartDate: {
    type: String,
    default: ''
  },
  customEndDate: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:customStartDate', 'update:customEndDate', 'change'])

// Standard 5 Filter Options
const filterOptions = [
  { key: '7d', label: '7 Days', aliases: ['7d', '7 Days', 'This Week', 'Week'] },
  { key: '30d', label: '30 Days', aliases: ['30d', '30 Days', 'This Month', 'Last 30 days', 'Month'] },
  { key: '3m', label: '3 Months', aliases: ['3m', '3 Months', 'This Quarter', 'Quarter'] },
  { key: '1y', label: '1 Year', aliases: ['1y', '1 Year', 'This Year', 'Year', 'All Time'] },
  { key: 'custom', label: 'Custom Range', aliases: ['custom', 'Custom Range', 'Custom'] }
]

// Determine canonical active key from modelValue
const activeKey = computed(() => {
  const val = (props.modelValue || '').toLowerCase().trim()
  for (const opt of filterOptions) {
    if (opt.key === val) return opt.key
    if (opt.aliases.some(a => a.toLowerCase() === val)) return opt.key
  }
  return '30d'
})

const showCustomModal = ref(false)

// Default custom dates (last 14 days)
const todayStr = new Date().toISOString().split('T')[0]
const twoWeeksAgoStr = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]

const localStartDate = ref(props.customStartDate || twoWeeksAgoStr)
const localEndDate = ref(props.customEndDate || todayStr)

watch(() => props.customStartDate, (val) => {
  if (val) localStartDate.value = val
})
watch(() => props.customEndDate, (val) => {
  if (val) localEndDate.value = val
})

const selectFilter = (key) => {
  if (key === 'custom') {
    showCustomModal.value = !showCustomModal.value
    if (!showCustomModal.value) return
  } else {
    showCustomModal.value = false
  }

  emit('update:modelValue', key)
  emit('change', {
    range: key,
    label: filterOptions.find(o => o.key === key)?.label || key,
    startDate: key === 'custom' ? localStartDate.value : null,
    endDate: key === 'custom' ? localEndDate.value : null
  })
}

const applyCustomRange = () => {
  if (!localStartDate.value || !localEndDate.value) return
  if (localStartDate.value > localEndDate.value) {
    // Swap if inverted
    const tmp = localStartDate.value
    localStartDate.value = localEndDate.value
    localEndDate.value = tmp
  }

  showCustomModal.value = false
  emit('update:modelValue', 'custom')
  emit('update:customStartDate', localStartDate.value)
  emit('update:customEndDate', localEndDate.value)
  emit('change', {
    range: 'custom',
    label: `Custom: ${localStartDate.value} to ${localEndDate.value}`,
    startDate: localStartDate.value,
    endDate: localEndDate.value
  })
}

const customRangeLabel = computed(() => {
  if (!localStartDate.value || !localEndDate.value) return 'Custom'
  const s = localStartDate.value.split('-').slice(1).join('/')
  const e = localEndDate.value.split('-').slice(1).join('/')
  return `${s} - ${e}`
})
</script>

<template>
  <div class="relative inline-flex items-center flex-wrap gap-1.5">
    <!-- Segmented 5-Filter Buttons Container -->
    <div class="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-xs">
      <button
        v-for="opt in filterOptions"
        :key="opt.key"
        type="button"
        @click="selectFilter(opt.key)"
        :class="[
          'px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none flex items-center gap-1',
          activeKey === opt.key
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        ]"
      >
        <span>{{ opt.label }}</span>
        <span 
          v-if="opt.key === 'custom' && activeKey === 'custom' && localStartDate && localEndDate" 
          class="text-[10px] font-mono opacity-90 hidden sm:inline"
        >
          ({{ customRangeLabel }})
        </span>
      </button>
    </div>

    <!-- Custom Range Popover Card -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showCustomModal"
        class="absolute top-full right-0 mt-2 z-50 bg-white p-4 rounded-xl shadow-xl border border-slate-200 w-72 flex flex-col gap-3 text-slate-800"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Calendar class="w-3.5 h-3.5 text-blue-600" />
            <span>Select Date Range</span>
          </div>
          <button 
            type="button" 
            @click="showCustomModal = false" 
            class="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <div>
            <label class="block text-[10.5px] font-semibold text-slate-500 mb-1">Start Date</label>
            <input
              type="date"
              v-model="localStartDate"
              class="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label class="block text-[10.5px] font-semibold text-slate-500 mb-1">End Date</label>
            <input
              type="date"
              v-model="localEndDate"
              class="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            @click="showCustomModal = false"
            class="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="applyCustomRange"
            class="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Check class="w-3 h-3" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
