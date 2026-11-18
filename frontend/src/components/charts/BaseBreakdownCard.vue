<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Array of items: [{ branch: 'Peshawar', value: 35, formatted: 'PKR 9.9M' }] or [{ label: 'Sales', value: 45 }]
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Breakdown'
  },
  valueSuffix: {
    type: String,
    default: '%'
  },
  showPercentage: {
    type: Boolean,
    default: true
  },
  // Design 3: Default Blue (#2563EB) for primary breakdown
  primaryColor: {
    type: String,
    default: '#2563EB'
  }
})

const normalizedItems = computed(() => {
  return props.items.map((item, idx) => {
    const label = item.branch || item.name || item.label || item.category || `Category ${idx + 1}`
    const rawVal = typeof item.value === 'number' ? item.value : (parseFloat(item.value) || 0)
    const percentage = item.percentage !== undefined ? item.percentage : rawVal
    const displayVal = item.formatted || (props.valueSuffix ? `${rawVal}${props.valueSuffix}` : String(rawVal))
    
    return {
      label,
      value: rawVal,
      percentage: Math.min(100, Math.max(0, percentage)),
      displayVal
    }
  })
})
</script>

<template>
  <div class="space-y-3">
    <div 
      v-for="item in normalizedItems" 
      :key="item.label" 
      class="group p-2.5 rounded-xl hover:bg-slate-50 transition-all duration-150 flex items-center gap-3 sm:gap-4 border border-transparent hover:border-slate-100"
    >
      <!-- Label Column -->
      <span class="w-24 sm:w-28 text-xs font-semibold text-slate-700 truncate group-hover:text-slate-900" :title="item.label">
        {{ item.label }}
      </span>

      <!-- Bar Track -->
      <div class="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
        <div 
          class="h-full rounded-full transition-all duration-500 group-hover:brightness-110 shadow-xs" 
          :style="{ 
            width: `${item.percentage}%`,
            backgroundColor: primaryColor 
          }"
        ></div>
      </div>

      <!-- Value / Percentage Badge -->
      <span class="min-w-[54px] text-right text-xs font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {{ item.displayVal }}
      </span>
    </div>
  </div>
</template>
