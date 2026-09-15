<script setup>
import { RouterView } from 'vue-router'
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
  </div>
</template>
