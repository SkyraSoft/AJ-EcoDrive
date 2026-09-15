<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cancel = () => {
  router.back()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="router.back()">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="router.back()" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Roles & Permissions / <span class="font-bold text-gray-800">Create / Edit Role</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create / Edit Role</h1>
        <p class="text-[13px] text-gray-500 mt-1">Define a new role and configure its module permissions and scope.</p>
      </div>
    </div>

    <!-- Role Details -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
      <h3 class="text-[13px] font-bold text-gray-900 mb-2">Role Details</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Role Name</label>
          <input type="text" placeholder="e.g. Area Manager" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Scope</label>
          <input type="text" placeholder="Assigned Branch" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>
      
      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Description</label>
        <textarea rows="2" placeholder="Brief description of the role's responsibilities" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
      </div>
    </div>

    <!-- Permission Matrix Configurator -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h3 class="text-[13px] font-bold text-gray-900">Module Permissions</h3>
        <button class="text-[11px] font-bold text-[#165A31] hover:text-[#124a28]">Grant All Access</button>
      </div>
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <th class="px-6 py-3">Module</th>
              <th class="px-6 py-3">View</th>
              <th class="px-6 py-3">Create</th>
              <th class="px-6 py-3">Edit</th>
              <th class="px-6 py-3">Approve</th>
              <th class="px-6 py-3">Export</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <!-- Catalogue -->
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Catalogue</td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Request only</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
            </tr>
            <!-- Inventory -->
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Inventory</td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Request/Receive</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
            </tr>
            <!-- Sales & CRM -->
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Sales & CRM</td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
            </tr>
            <!-- Expenses -->
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Expenses</td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Within policy</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
              <td class="px-6 py-4"><input type="checkbox" checked class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
            </tr>
            <!-- Finance -->
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Finance</td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Branch only</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Limited</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
            </tr>
            <!-- Organisation -->
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">Organisation</td>
              <td class="px-6 py-4">
                <select class="text-[11px] border border-gray-200 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#165A31] text-gray-700 bg-white">
                  <option>Team only</option>
                  <option>Full access</option>
                  <option>None</option>
                </select>
              </td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
              <td class="px-6 py-4"><input type="checkbox" class="w-3.5 h-3.5 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" /></td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-4">
      <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Cancel
      </button>
      <button class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Save Role
      </button>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>