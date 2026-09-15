<script setup>
import { useRouter } from 'vue-router'
import { Printer, Download, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const invoiceData = {
  invoiceNo: 'INV-4402',
  orderNo: 'SO-7731',
  date: 'Aug 27, 2026',
  dueDate: 'Sep 10, 2026',
  status: 'Paid',
  branch: 'Islamabad Branch',
  customer: {
    name: 'Saad Ahmad',
    phone: '+92 300 1234567',
    address: '123 Main Street, F-8, Islamabad'
  },
  items: [
    { description: 'BRG DS11 - Chassis: CH-88194', qty: 1, price: '185,000', total: '185,000' }
  ],
  subtotal: '185,000',
  discount: '0',
  total: '185,000',
  paid: '185,000',
  balance: '0'
}

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="max-w-[1000px] mx-auto space-y-6 pb-12">
    <!-- Actions Header -->
    <div class="flex items-center justify-between no-print mb-6">
      <button @click="router.push('/sales/invoices')" class="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to Invoices
      </button>
      <div class="flex items-center gap-3">
        <button @click="handlePrint" class="px-4 py-2 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-2">
          <Printer class="w-4 h-4" /> Print
        </button>
        <button class="px-4 py-2 text-[12px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center gap-2">
          <Download class="w-4 h-4" /> Download PDF
        </button>
      </div>
    </div>

    <!-- Printable Invoice Paper -->
    <div class="bg-white border border-gray-200 shadow-sm rounded-xl p-10 print:border-none print:shadow-none print:p-0">
      
      <!-- Invoice Header -->
      <div class="flex items-start justify-between border-b border-gray-100 pb-8 mb-8">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">AJ ECODRIVE</h1>
          <p class="text-sm text-gray-500 mt-1">BRG Management System</p>
          <p class="text-sm text-gray-500 mt-4">{{ invoiceData.branch }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-4xl font-black text-gray-200 uppercase tracking-widest mb-4">Invoice</h2>
          <div class="flex flex-col gap-1 text-[13px]">
            <div class="flex justify-end gap-4">
              <span class="text-gray-500">Invoice No:</span>
              <span class="font-bold text-gray-900 w-24">{{ invoiceData.invoiceNo }}</span>
            </div>
            <div class="flex justify-end gap-4">
              <span class="text-gray-500">Order No:</span>
              <span class="font-bold text-gray-900 w-24">{{ invoiceData.orderNo }}</span>
            </div>
            <div class="flex justify-end gap-4">
              <span class="text-gray-500">Date Issued:</span>
              <span class="font-bold text-gray-900 w-24">{{ invoiceData.date }}</span>
            </div>
            <div class="flex justify-end gap-4">
              <span class="text-gray-500">Status:</span>
              <span class="font-bold text-[#165A31] w-24">{{ invoiceData.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div class="mb-10">
        <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To</h3>
        <p class="text-[14px] font-bold text-gray-900">{{ invoiceData.customer.name }}</p>
        <p class="text-[13px] text-gray-600 mt-1">{{ invoiceData.customer.phone }}</p>
        <p class="text-[13px] text-gray-600">{{ invoiceData.customer.address }}</p>
      </div>

      <!-- Items Table -->
      <div class="mb-10 rounded-lg overflow-hidden border border-gray-100 print:border-gray-300">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 print:bg-gray-100 print:border-gray-300 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Description</th>
              <th class="px-5 py-3 text-center">Qty</th>
              <th class="px-5 py-3 text-right">Unit Price</th>
              <th class="px-5 py-3 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody class="text-[13px]">
            <tr v-for="(item, index) in invoiceData.items" :key="index" class="border-b border-gray-50 print:border-gray-200">
              <td class="px-5 py-4 text-gray-900 font-medium">{{ item.description }}</td>
              <td class="px-5 py-4 text-center text-gray-600">{{ item.qty }}</td>
              <td class="px-5 py-4 text-right text-gray-600">PKR {{ item.price }}</td>
              <td class="px-5 py-4 text-right text-gray-900 font-bold">PKR {{ item.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="flex justify-end">
        <div class="w-64 space-y-3 text-[13px]">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-medium text-gray-900">PKR {{ invoiceData.subtotal }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Discount</span>
            <span class="font-medium text-gray-900">PKR {{ invoiceData.discount }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
            <span class="font-bold text-gray-900">Total</span>
            <span class="text-[16px] font-black text-gray-900">PKR {{ invoiceData.total }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Amount Paid</span>
            <span class="font-medium text-[#165A31]">PKR {{ invoiceData.paid }}</span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <span class="font-bold text-gray-900">Balance Due</span>
            <span class="font-bold text-gray-900">PKR {{ invoiceData.balance }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div class="mt-16 pt-8 border-t border-gray-100 text-center text-[11px] text-gray-400">
        <p>Thank you for your business.</p>
        <p class="mt-1">This is a system generated document and does not require a signature.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white;
  }
}
</style>
