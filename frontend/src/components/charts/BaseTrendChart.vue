<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Array of numbers or objects: [45, 60, 75, ...] or [{ label: 'Apr', value: 45, fullValue: 'PKR 45.2M' }, ...]
  data: {
    type: Array,
    default: null
  },
  // Alias for data
  dataPoints: {
    type: Array,
    default: null
  },
  // Secondary series for comparison (optional)
  secondaryData: {
    type: Array,
    default: null
  },
  // Alias for secondaryData
  secondaryPoints: {
    type: Array,
    default: null
  },
  // X-axis labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  labels: {
    type: Array,
    default: () => []
  },
  // Unit or prefix/suffix for Y-axis (e.g. 'PKR', '%', 'Units')
  unit: {
    type: String,
    default: ''
  },
  // Primary series name (for legend/tooltip)
  seriesName: {
    type: String,
    default: 'Revenue'
  },
  // Secondary series name
  secondarySeriesName: {
    type: String,
    default: ''
  },
  secondaryName: {
    type: String,
    default: 'Target'
  },
  // Height class or px
  heightClass: {
    type: String,
    default: ''
  },
  height: {
    type: [Number, String],
    default: null
  },
  // Value formatter function
  formatValue: {
    type: Function,
    default: (val) => String(val)
  },
  // Design 3 Colors: Blue (#2563EB) for Sales/Primary metrics, Green (#10B981) for Profit
  strokeColor: {
    type: String,
    default: '#2563EB'
  },
  secondaryStrokeColor: {
    type: String,
    default: '#10B981'
  },
  smooth: {
    type: Boolean,
    default: true
  }
})

// Unified resolved props
const resolvedData = computed(() => props.data || props.dataPoints || [])
const resolvedSecondaryData = computed(() => props.secondaryData || props.secondaryPoints || null)
const resolvedSecondaryName = computed(() => props.secondarySeriesName || props.secondaryName || 'Comparison')

const containerHeightClass = computed(() => {
  if (props.heightClass) return props.heightClass
  if (props.height) {
    return typeof props.height === 'number' ? `h-[${props.height}px]` : `h-[${props.height}]`
  }
  return 'h-56'
})

// Normalized point objects
const points = computed(() => {
  return resolvedData.value.map((item, idx) => {
    let rawVal = 0
    let label = props.labels[idx] || `P${idx + 1}`
    let displayVal = ''
    let fullVal = ''

    if (typeof item === 'object' && item !== null) {
      rawVal = item.value !== undefined ? Number(item.value) : 0
      label = item.period || item.label || item.name || label
      displayVal = item.formatted || props.formatValue(rawVal)
      fullVal = item.fullValue || item.formatted || displayVal
    } else {
      rawVal = Number(item) || 0
      displayVal = props.formatValue(rawVal)
      fullVal = displayVal
    }

    return {
      index: idx,
      value: rawVal,
      label,
      displayVal,
      fullVal
    }
  })
})

const secondaryPointsList = computed(() => {
  if (!resolvedSecondaryData.value) return null
  return resolvedSecondaryData.value.map((item, idx) => {
    let rawVal = 0
    let label = props.labels[idx] || `P${idx + 1}`
    let displayVal = ''
    let fullVal = ''

    if (typeof item === 'object' && item !== null) {
      rawVal = item.value !== undefined ? Number(item.value) : 0
      label = item.period || item.label || item.name || label
      displayVal = item.formatted || props.formatValue(rawVal)
      fullVal = item.fullValue || item.formatted || displayVal
    } else {
      rawVal = Number(item) || 0
      displayVal = props.formatValue(rawVal)
      fullVal = displayVal
    }

    return {
      index: idx,
      value: rawVal,
      label,
      displayVal,
      fullVal
    }
  })
})

// Calculate Min & Max for Y-axis scaling
const yBounds = computed(() => {
  let allVals = points.value.map(p => p.value)
  if (secondaryPointsList.value) {
    allVals = allVals.concat(secondaryPointsList.value.map(p => p.value))
  }
  if (allVals.length === 0) return { min: 0, max: 100 }
  const minVal = Math.min(...allVals, 0)
  let maxVal = Math.max(...allVals, 10)
  if (maxVal === minVal) maxVal += 10
  // Add 12% ceiling buffer for clean aesthetics
  const ceiling = Math.ceil(maxVal * 1.12)
  return { min: minVal, max: ceiling }
})

// 4 Clean Y-Axis Ticks
const yTicks = computed(() => {
  const { min, max } = yBounds.value
  const step = (max - min) / 3
  return [
    { value: max, label: props.formatValue(Math.round(max)) },
    { value: Math.round(min + step * 2), label: props.formatValue(Math.round(min + step * 2)) },
    { value: Math.round(min + step), label: props.formatValue(Math.round(min + step)) },
    { value: min, label: props.formatValue(Math.round(min)) }
  ]
})

// SVG Coordinates
const V_WIDTH = 540
const V_HEIGHT = 210
const M_LEFT = 72
const M_RIGHT = 24
const M_TOP = 22
const M_BOTTOM = 36

const innerWidth = V_WIDTH - M_LEFT - M_RIGHT
const innerHeight = V_HEIGHT - M_TOP - M_BOTTOM

const getY = (val) => {
  const { min, max } = yBounds.value
  if (max === min) return M_TOP + innerHeight / 2
  const normalized = (val - min) / (max - min)
  return M_TOP + (1 - normalized) * innerHeight
}

const getX = (index, total) => {
  if (total <= 1) return M_LEFT + innerWidth / 2
  return M_LEFT + (index / (total - 1)) * innerWidth
}

// Generate Smooth Cubic Bezier Curves for Design 3
const generateSmoothPath = (pts) => {
  const total = pts.length
  if (total === 0) return ''
  if (total === 1) return `M ${getX(0, 1)} ${getY(pts[0].value)}`
  if (total === 2) {
    return `M ${getX(0, total).toFixed(1)} ${getY(pts[0].value).toFixed(1)} L ${getX(1, total).toFixed(1)} ${getY(pts[1].value).toFixed(1)}`
  }

  const coords = pts.map((p, i) => ({
    x: getX(i, total),
    y: getY(p.value)
  }))

  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = i > 0 ? coords[i - 1] : coords[i]
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const p3 = i < coords.length - 2 ? coords[i + 2] : p2

    // Cubic spline control points with 0.18 smoothing factor
    const cp1x = p1.x + (p2.x - p0.x) * 0.18
    const cp1y = p1.y + (p2.y - p0.y) * 0.18
    const cp2x = p2.x - (p3.x - p1.x) * 0.18
    const cp2y = p2.y - (p3.y - p1.y) * 0.18

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  return path
}

const linePath = computed(() => generateSmoothPath(points.value))

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const total = points.value.length
  const firstX = getX(0, total).toFixed(1)
  const lastX = getX(total - 1, total).toFixed(1)
  const bottomY = (M_TOP + innerHeight).toFixed(1)
  return `${linePath.value} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
})

const secondaryLinePath = computed(() => {
  if (!secondaryPointsList.value || secondaryPointsList.value.length === 0) return ''
  return generateSmoothPath(secondaryPointsList.value)
})

// Interactive Hover State
const hoveredIndex = ref(null)

const activePoint = computed(() => {
  if (hoveredIndex.value === null || hoveredIndex.value >= points.value.length) return null
  const p = points.value[hoveredIndex.value]
  const x = getX(p.index, points.value.length)
  const y = getY(p.value)
  return { ...p, x, y }
})

const activeSecondaryPoint = computed(() => {
  if (!secondaryPointsList.value || hoveredIndex.value === null || hoveredIndex.value >= secondaryPointsList.value.length) return null
  const p = secondaryPointsList.value[hoveredIndex.value]
  return { ...p, y: getY(p.value) }
})

const gradientId = `trend-gradient-${Math.random().toString(36).substring(2, 9)}`
</script>

<template>
  <div class="relative w-full flex flex-col select-none">
    <!-- Top Legend (When secondary data or multi-series is active) -->
    <div v-if="resolvedSecondaryData" class="flex items-center justify-end gap-5 mb-2.5 px-1 text-xs font-semibold">
      <div class="flex items-center gap-1.5 text-slate-800">
        <span class="w-2.5 h-2.5 rounded-full inline-block shadow-xs" :style="{ backgroundColor: strokeColor }"></span>
        <span class="font-medium text-slate-700">{{ seriesName }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-500">
        <span class="w-2.5 h-2.5 rounded-full inline-block border border-slate-300" :style="{ backgroundColor: secondaryStrokeColor }"></span>
        <span class="font-medium text-slate-600">{{ resolvedSecondaryName }}</span>
      </div>
    </div>

    <!-- Chart Container - Design 3 Clean White Card with Subtle Border -->
    <div :class="['w-full relative overflow-visible rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-2 sm:p-3.5', containerHeightClass]">
      <svg 
        class="w-full h-full overflow-visible" 
        :viewBox="`0 0 ${V_WIDTH} ${V_HEIGHT}`" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="strokeColor" stop-opacity="0.18" />
            <stop offset="60%" :stop-color="strokeColor" stop-opacity="0.04" />
            <stop offset="100%" :stop-color="strokeColor" stop-opacity="0.00" />
          </linearGradient>
        </defs>

        <!-- Horizontal Clean Subtle Grid Lines & Y-Axis Labels -->
        <g class="grid-lines">
          <g v-for="(tick, idx) in yTicks" :key="idx">
            <line 
              :x1="M_LEFT" 
              :y1="getY(tick.value)" 
              :x2="V_WIDTH - M_RIGHT" 
              :y2="getY(tick.value)" 
              stroke="#F1F5F9" 
              stroke-width="1" 
              stroke-dasharray="3 3"
            />
            <text 
              :x="M_LEFT - 10" 
              :y="getY(tick.value) + 3.5" 
              text-anchor="end" 
              fill="#64748B" 
              font-size="9.5" 
              font-weight="500"
              class="font-mono tracking-tight"
            >
              {{ tick.label }}
            </text>
          </g>
        </g>

        <!-- Baseline Axis Line -->
        <line 
          :x1="M_LEFT" 
          :y1="M_TOP + innerHeight" 
          :x2="V_WIDTH - M_RIGHT" 
          :y2="M_TOP + innerHeight" 
          stroke="#CBD5E1" 
          stroke-width="1.2"
        />

        <!-- Secondary Series Line (if provided, e.g. Target or Baseline) -->
        <path 
          v-if="secondaryLinePath" 
          :d="secondaryLinePath" 
          fill="none" 
          :stroke="secondaryStrokeColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          stroke-dasharray="4 4"
        />

        <!-- Primary Series Gradient Soft Area Fill -->
        <path 
          :d="areaPath" 
          :fill="`url(#${gradientId})`"
        />

        <!-- Primary Series Stroke Line - Smooth Curve -->
        <path 
          :d="linePath" 
          fill="none" 
          :stroke="strokeColor" 
          stroke-width="2.75" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />

        <!-- Vertical Guide Line on Active Hover -->
        <line 
          v-if="activePoint"
          :x1="activePoint.x" 
          :y1="M_TOP" 
          :x2="activePoint.x" 
          :y2="M_TOP + innerHeight" 
          stroke="#94A3B8" 
          stroke-width="1.25" 
          stroke-dasharray="2 2"
          stroke-opacity="0.8"
        />

        <!-- Data Points (Circles) & Interactive Hitboxes -->
        <g v-for="(p, i) in points" :key="p.index">
          <!-- Visible Primary Point Circle -->
          <circle 
            :cx="getX(i, points.length)" 
            :cy="getY(p.value)" 
            :r="hoveredIndex === i ? 5.5 : 3.5" 
            fill="#ffffff" 
            :stroke="strokeColor" 
            :stroke-width="hoveredIndex === i ? 3 : 2.25"
            class="transition-all duration-150"
          />

          <!-- Invisible Large Interactive Hitbox for Touch/Mouse -->
          <circle 
            :cx="getX(i, points.length)" 
            :cy="getY(p.value)" 
            r="18" 
            fill="transparent" 
            class="cursor-pointer"
            @mouseenter="hoveredIndex = i"
            @mouseleave="hoveredIndex = null"
          />
        </g>

        <!-- X-Axis Labels -->
        <g class="x-axis-labels">
          <g v-for="(p, i) in points" :key="`lbl-${i}`">
            <text 
              :x="getX(i, points.length)" 
              :y="M_TOP + innerHeight + 18" 
              text-anchor="middle" 
              fill="#64748B" 
              font-size="10" 
              font-weight="500"
              class="tracking-tight"
            >
              {{ p.label }}
            </text>
            <line 
              :x1="getX(i, points.length)" 
              :y1="M_TOP + innerHeight" 
              :x2="getX(i, points.length)" 
              :y2="M_TOP + innerHeight + 4" 
              stroke="#CBD5E1" 
              stroke-width="1"
            />
          </g>
        </g>
      </svg>

      <!-- Floating Interactive Tooltip Card - Design 3 Navy Tooltip -->
      <transition 
        enter-active-class="transition duration-150 ease-out" 
        enter-from-class="transform scale-95 opacity-0" 
        enter-to-class="transform scale-100 opacity-100" 
        leave-active-class="transition duration-100 ease-in" 
        leave-from-class="transform scale-100 opacity-100" 
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-if="activePoint"
          class="absolute z-30 pointer-events-none bg-[#0F172A]/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-1 whitespace-nowrap -translate-x-1/2 -translate-y-full mb-3"
          :style="{
            left: `${Math.max(12, Math.min(88, (activePoint.x / V_WIDTH) * 100))}%`,
            top: `${(activePoint.y / V_HEIGHT) * 100}%`
          }"
        >
          <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between gap-4">
            <span>{{ activePoint.label }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-1.5 text-slate-300 font-medium">
              <span class="w-2 h-2 rounded-full inline-block" :style="{ backgroundColor: strokeColor }"></span>
              <span>{{ seriesName }}:</span>
            </div>
            <span class="text-white font-bold font-mono">{{ activePoint.fullVal }}</span>
          </div>
          <div v-if="activeSecondaryPoint" class="flex items-center justify-between gap-4 border-t border-slate-800 pt-1 mt-0.5">
            <div class="flex items-center gap-1.5 text-slate-400 font-medium">
              <span class="w-2 h-2 rounded-full inline-block" :style="{ backgroundColor: secondaryStrokeColor }"></span>
              <span>{{ resolvedSecondaryName }}:</span>
            </div>
            <span class="text-emerald-400 font-bold font-mono">{{ activeSecondaryPoint.fullVal || activeSecondaryPoint.displayVal }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
