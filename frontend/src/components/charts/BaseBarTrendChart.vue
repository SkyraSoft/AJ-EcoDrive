<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Array of items: [{ label: 'Apr', value: 45, fullValue: 'PKR 14.5M' }] or numbers [45, 65, 80]
  data: {
    type: Array,
    default: null
  },
  dataPoints: {
    type: Array,
    default: null
  },
  // Optional secondary comparison value for grouped bars (e.g. Target)
  secondaryData: {
    type: Array,
    default: null
  },
  secondaryPoints: {
    type: Array,
    default: null
  },
  // Labels: ['Apr', 'May', 'Jun', ...]
  labels: {
    type: Array,
    default: () => []
  },
  seriesName: {
    type: String,
    default: 'Current'
  },
  secondarySeriesName: {
    type: String,
    default: 'Target'
  },
  heightClass: {
    type: String,
    default: ''
  },
  height: {
    type: [Number, String],
    default: null
  },
  formatValue: {
    type: Function,
    default: (val) => String(val)
  },
  // Design 3: Default Blue (#2563EB) for primary sales / metrics
  primaryColor: {
    type: String,
    default: '#2563EB'
  },
  secondaryColor: {
    type: String,
    default: '#94A3B8'
  },
  // Whether to wrap in a standalone white card (false when placed inside an existing card)
  card: {
    type: Boolean,
    default: false
  },
  // Show formatted values directly on top of bars for instant readability
  showValues: {
    type: Boolean,
    default: true
  }
})

const resolvedData = computed(() => props.data || props.dataPoints || [])
const resolvedSecondaryData = computed(() => props.secondaryData || props.secondaryPoints || null)

const containerHeightClass = computed(() => {
  if (props.heightClass) return props.heightClass
  if (props.height) {
    return typeof props.height === 'number' ? `h-[${props.height}px]` : `h-[${props.height}]`
  }
  return 'h-56'
})

const hoveredIndex = ref(null)

const items = computed(() => {
  return resolvedData.value.map((item, idx) => {
    let rawVal = 0
    let label = props.labels[idx] || `P${idx + 1}`
    let fullVal = ''

    if (typeof item === 'object' && item !== null) {
      rawVal = item.value !== undefined ? Number(item.value) : 0
      label = item.label || item.period || item.name || label
      fullVal = item.fullValue || item.formatted || props.formatValue(rawVal)
    } else {
      rawVal = Number(item) || 0
      fullVal = props.formatValue(rawVal)
    }

    let secVal = null
    let secFullVal = null
    if (resolvedSecondaryData.value && resolvedSecondaryData.value[idx] !== undefined) {
      const sItem = resolvedSecondaryData.value[idx]
      if (typeof sItem === 'object' && sItem !== null) {
        secVal = sItem.value !== undefined ? Number(sItem.value) : 0
        secFullVal = sItem.fullValue || sItem.formatted || props.formatValue(secVal)
      } else {
        secVal = Number(sItem) || 0
        secFullVal = props.formatValue(secVal)
      }
    }

    return {
      index: idx,
      value: rawVal,
      label,
      fullVal,
      secVal,
      secFullVal
    }
  })
})

const maxVal = computed(() => {
  const vals = items.value.map(i => i.value)
  if (resolvedSecondaryData.value) {
    items.value.forEach(i => {
      if (i.secVal !== null) vals.push(i.secVal)
    })
  }
  const highest = Math.max(...vals, 10)
  // 25% headroom ensures direct value labels above the tallest bars have plenty of space
  return Math.ceil(highest * 1.25)
})

const yTicks = computed(() => {
  const max = maxVal.value
  const step = max / 3
  return [
    { value: max, label: props.formatValue(Math.round(max)) },
    { value: Math.round(step * 2), label: props.formatValue(Math.round(step * 2)) },
    { value: Math.round(step), label: props.formatValue(Math.round(step)) },
    { value: 0, label: props.formatValue(0) }
  ]
})
</script>

<template>
  <div class="relative w-full flex flex-col select-none">
    <!-- Top Legend (When grouped) -->
    <div v-if="resolvedSecondaryData" class="flex items-center justify-end gap-5 mb-2.5 px-1 text-xs font-semibold">
      <div class="flex items-center gap-1.5 text-slate-800">
        <span class="w-2.5 h-2.5 rounded-sm inline-block shadow-xs" :style="{ backgroundColor: primaryColor }"></span>
        <span class="font-medium text-slate-700">{{ seriesName }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-500">
        <span class="w-2.5 h-2.5 rounded-sm inline-block border border-slate-300" :style="{ backgroundColor: secondaryColor }"></span>
        <span class="font-medium text-slate-600">{{ secondarySeriesName }}</span>
      </div>
    </div>

    <!-- Chart Container -->
    <div 
      :class="[
        'w-full relative flex flex-col justify-between',
        card ? 'rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-3 sm:p-4' : 'pt-2',
        containerHeightClass
      ]"
    >
      <!-- Background Horizontal Grid Lines -->
      <div 
        class="absolute inset-x-0 top-3 bottom-9 flex flex-col justify-between pointer-events-none"
        :class="card ? 'px-3 sm:px-4' : 'px-1'"
      >
        <div 
          v-for="(tick, idx) in yTicks" 
          :key="idx" 
          class="flex items-center w-full"
        >
          <span class="w-16 text-right pr-2 text-[10px] font-mono font-medium text-slate-500 shrink-0">
            {{ tick.label }}
          </span>
          <div class="flex-1 border-b border-dashed border-slate-200/80"></div>
        </div>
      </div>

      <!-- Bars Flex Grid -->
      <div class="relative z-10 flex-1 ml-16 flex items-end justify-between px-2 sm:px-4 gap-2 sm:gap-4 mb-7 pt-4">
        <div 
          v-for="(item, idx) in items" 
          :key="idx"
          class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
        >
          <!-- Tooltip on hover - Design 3 Navy Tooltip -->
          <transition 
            enter-active-class="transition duration-100 ease-out" 
            enter-from-class="opacity-0 scale-95" 
            enter-to-class="opacity-100 scale-100"
          >
            <div 
              v-if="hoveredIndex === idx" 
              class="absolute -top-12 z-30 pointer-events-none bg-[#0F172A]/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-xl text-xs whitespace-nowrap border border-slate-700/60 flex flex-col items-center gap-0.5"
            >
              <span class="text-[10px] text-slate-400 font-medium">{{ item.label }}</span>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-xs" :style="{ backgroundColor: primaryColor }"></span>
                <span class="text-white font-bold font-mono">{{ item.fullVal }}</span>
              </div>
              <div v-if="item.secVal !== null" class="flex items-center gap-1.5 text-[10.5px] text-slate-300">
                <span class="w-2 h-2 rounded-xs" :style="{ backgroundColor: secondaryColor }"></span>
                <span class="text-slate-300">{{ secondarySeriesName }}: {{ item.secFullVal }}</span>
              </div>
            </div>
          </transition>

          <!-- Grouped or Single Bar Columns with Direct Values -->
          <div 
            class="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-full"
            :class="item.secVal !== null ? 'max-w-[72px]' : 'max-w-[44px]'"
          >
            <!-- Primary Bar Column -->
            <div class="flex-1 flex flex-col items-center justify-end h-full">
              <span 
                v-if="showValues"
                class="text-[9.5px] sm:text-[10.5px] font-mono font-bold text-slate-800 mb-1 text-center truncate max-w-full tracking-tight transition-transform group-hover:scale-105"
                :title="item.fullVal"
              >
                {{ item.fullVal }}
              </span>
              <div 
                class="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                :style="{ 
                  height: `${Math.max(4, Math.round((item.value / maxVal) * 100))}%`,
                  backgroundColor: primaryColor
                }"
              ></div>
            </div>

            <!-- Secondary Bar Column (if comparison active) -->
            <div 
              v-if="item.secVal !== null" 
              class="flex-1 flex flex-col items-center justify-end h-full"
            >
              <span 
                v-if="showValues"
                class="text-[9.5px] sm:text-[10.5px] font-mono font-semibold text-slate-600 mb-1 text-center truncate max-w-full tracking-tight transition-transform group-hover:scale-105"
                :title="item.secFullVal"
              >
                {{ item.secFullVal }}
              </span>
              <div 
                class="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                :style="{ 
                  height: `${Math.max(4, Math.round((item.secVal / maxVal) * 100))}%`,
                  backgroundColor: secondaryColor
                }"
              ></div>
            </div>
          </div>

          <!-- X-Axis Label -->
          <span class="absolute -bottom-6 text-[10.5px] sm:text-[11px] font-semibold text-slate-700 truncate max-w-full text-center group-hover:text-blue-600 transition-colors">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
