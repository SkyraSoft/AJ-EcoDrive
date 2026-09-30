<template>
  <div class="fixed bottom-6 right-6 z-[9999] font-sans">
    <!-- Collapsed Floating Badge / Trigger -->
    <button
      v-if="!dapStore.hudExpanded"
      @click="dapStore.hudExpanded = true"
      class="flex items-center gap-3 px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-emerald-500/40 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 group"
    >
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-sm">
        <span>🎯</span>
        <span v-if="dapStore.isActive" class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>
      <div class="text-left">
        <div class="text-xs font-bold text-white flex items-center gap-1.5">
          <span>Branch Mastery</span>
          <span class="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
            {{ dapStore.masteryPercentage }}%
          </span>
        </div>
        <div class="text-[10px] text-slate-400">
          {{ dapStore.isActive ? `Stage ${dapStore.currentMissionIndex + 1}: ${dapStore.currentMission.title.substring(0, 24)}...` : 'Click to Launch Guided Walkthrough' }}
        </div>
      </div>
    </button>

    <!-- Expanded DAP Training Bridge Drawer -->
    <div
      v-else
      class="w-96 max-h-[85vh] flex flex-col bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      <!-- Header -->
      <div class="p-5 pb-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
            🎯
          </div>
          <div>
            <h4 class="text-sm font-bold text-white leading-tight">Branch Manager DAP</h4>
            <p class="text-[11px] text-slate-400">Operational Training & Adoption Engine</p>
          </div>
        </div>
        <button
          @click="dapStore.hudExpanded = false"
          class="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mastery Score Overview Card -->
      <div class="p-5 py-4 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800/80">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="text-slate-300 font-medium">Dealership Operational Mastery</span>
          <span class="text-emerald-400 font-bold font-mono text-sm">{{ dapStore.masteryPercentage }}%</span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
          <div
            class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            :style="{ width: `${dapStore.masteryPercentage}%` }"
          ></div>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>{{ dapStore.totalCompletedStepsCount }} / {{ dapStore.totalSystemSteps }} checkpoints verified</span>
          <span class="text-emerald-400">{{ dapStore.completedMissions.length }} / {{ dapStore.totalMissions }} stages complete</span>
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="p-4 bg-slate-950/40 border-b border-slate-800 flex gap-2">
        <button
          @click="toggleActiveTour"
          class="flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
          :class="dapStore.isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'"
        >
          <span>{{ dapStore.isActive ? '⏸️ Pause Walkthrough' : '▶️ Start / Resume Tour' }}</span>
        </button>
        <button
          @click="dapStore.resetAllProgress()"
          class="p-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors"
          title="Reset Mastery Progress"
        >
          🔄
        </button>
      </div>

      <!-- 8-Stage Chronological Lifecycle Missions List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2 max-h-[340px] divide-y divide-slate-800/40">
        <div
          v-for="(mission, mIdx) in dapStore.missions"
          :key="mission.id"
          class="pt-2 first:pt-0"
        >
          <div
            @click="selectMission(mission.id)"
            class="p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 border"
            :class="getMissionCardClass(mission, mIdx)"
          >
            <div class="text-lg mt-0.5">{{ mission.icon }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="text-xs font-bold text-white truncate">
                  {{ mission.code }}: {{ mission.title }}
                </span>
                <span
                  v-if="dapStore.completedMissions.includes(mission.id)"
                  class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                >
                  ✓ Done
                </span>
              </div>
              <p class="text-[11px] text-slate-400 leading-snug line-clamp-1">
                {{ mission.subtitle || mission.description || mission.category }}
              </p>
              <div class="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>{{ mission.steps?.length || 0 }} practical steps</span>
                <span class="text-emerald-400/80 font-medium">Route: {{ mission.route || mission.chapters?.[0]?.route || '/dashboard' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="p-3 bg-slate-950/80 border-t border-slate-800 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5">
        <span>🇵🇰</span> Grounded in Pakistani EV Showroom Best Practices
      </div>
    </div>
  </div>
</template>

<script setup>
import { dapStore } from '@/stores/dapStore.js'

function toggleActiveTour() {
  dapStore.toggleDAP()
}

function selectMission(missionId) {
  dapStore.startDAP(missionId, 0)
}

function getMissionCardClass(mission, mIdx) {
  const isCurrent = dapStore.isActive && dapStore.currentMissionIndex === mIdx
  const isCompleted = dapStore.completedMissions.includes(mission.id)

  if (isCurrent) {
    return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
  }
  if (isCompleted) {
    return 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
  }
  return 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:bg-slate-800/50'
}
</script>
