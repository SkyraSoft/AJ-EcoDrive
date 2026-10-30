<script setup>
import { RouterView } from 'vue-router'
import { store } from '@/store.js'
import { X } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex bg-[#f7f8f9]">
    <!-- Left Panel (Branding) -->
    <div class="hidden lg:flex lg:w-1/2 bg-[#165A31] text-white p-16 flex-col justify-between">
      
      <!-- Logo & Title -->
      <div class="flex items-center gap-3">
        <div class="bg-white text-[#165A31] font-bold text-xl rounded-lg w-12 h-12 flex items-center justify-center">
          AJ
        </div>
        <div>
          <h1 class="font-bold tracking-widest text-lg leading-tight">AJ ECODRIVE</h1>
          <p class="text-[10px] tracking-widest uppercase text-white/80">BRG MANAGEMENT SYSTEM</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-xl">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6 leading-tight">One secure gateway to AJ ECODRIVE operations.</h2>
        <p class="text-white/90 text-lg mb-10 leading-relaxed">
          Role-based access routes Super Admin and Branch Manager accounts directly to the correct workspace. Users never select their own role.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white/10 p-5 rounded-xl border border-white/10">
            <p class="text-sm font-medium">Super Admin: organisation-wide control with mandatory MFA.</p>
          </div>
          <div class="bg-white/10 p-5 rounded-xl border border-white/10">
            <p class="text-sm font-medium">Branch Manager: permanently assigned branch context with scoped permissions.</p>
          </div>
          <div class="bg-white/10 p-5 rounded-xl border border-white/10">
            <p class="text-sm font-medium">Central authentication and session management.</p>
          </div>
          <div class="bg-white/10 p-5 rounded-xl border border-white/10">
            <p class="text-sm font-medium">Password recovery avoids exposing whether an account exists.</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-sm text-white/60 font-medium">
        AJ ECODRIVE • Exclusive BRG dealership management
      </div>
    </div>

    <!-- Right Panel (Forms) -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#fafafa]">
      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </div>

    <!-- Toast Notification for Auth Layout -->
    <div
      v-if="store.activeToast"
      id="layout-toast-notification"
      class="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md border"
      :class="{
        'border-emerald-500/40': (store.activeToast?.type || 'success') === 'success',
        'border-rose-500/40': store.activeToast?.type === 'error',
        'border-amber-500/40': store.activeToast?.type === 'warning',
        'border-blue-500/40': store.activeToast?.type === 'info'
      }"
      role="alert"
    >
      <div 
        class="w-2.5 h-2.5 rounded-full animate-pulse"
        :class="{
          'bg-emerald-400': (store.activeToast?.type || 'success') === 'success',
          'bg-rose-500': store.activeToast?.type === 'error',
          'bg-amber-400': store.activeToast?.type === 'warning',
          'bg-blue-400': store.activeToast?.type === 'info'
        }"
      ></div>
      <p class="text-xs font-medium text-slate-200">{{ store.activeToast?.message }}</p>
      <button
        @click="store.dismissToast()"
        class="ml-auto text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
