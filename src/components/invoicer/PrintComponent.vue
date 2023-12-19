<script setup lang="ts">
import { currencyFormat } from '@/util/currency-format'
import { useInvoicerStore } from '@/stores/invoicer'
import { storeToRefs } from 'pinia'
import { nextTick, watch } from 'vue'

const invoicerStore = useInvoicerStore()

const { printingInvoice: invoice } = storeToRefs(invoicerStore)

watch(invoice, () => {
  if (invoice.value) {
    nextTick(() => {
      window.print()
      invoicerStore.setPrintingInvoice(null)
    })
  }
})
</script>

<template>
  <div v-if="invoice" class="hidden print:block">
    <div>
      <h1 class="text-4xl text-center font-bold text-slate-700">Bar Tolome</h1>
      <h2 class="text-3xl text-center font-bold text-slate-700">Venta # {{ invoice.number }}</h2>
      <p class="text-slate-500 text-center text-2xl">Cliente: {{ invoice.customer?.name }}</p>
    </div>
    <table class="w-full">
      <tr>
        <th class="border-b px-4 py-2">Q</th>
        <th class="border-b px-4 py-2">Producto</th>
        <th class="border-b px-4 py-2 text-right">Precio</th>
      </tr>
      <tr v-for="product in invoice.products" :key="product._id!.toString()">
        <td class="border-b px-1 py-1">{{ product.quantity }}</td>
        <td class="border-b px-1 py-1">{{ product.name }}</td>
        <td class="border-b px-1 py-1 text-right">{{ currencyFormat(product.price) }}</td>
      </tr>
      <tr v-if="invoice.discount">
        <td colspan="2" class="px-1 py-1 text-right">Sub Total</td>
        <td class="px-1 py-1 text-right">{{ currencyFormat(invoice.total - invoice.discount) }}</td>
      </tr>
      <tr v-if="invoice.discount">
        <td colspan="2" class="px-1 py-1 text-right">Descuento</td>
        <td class="px-1 py-1 text-right">{{ currencyFormat(invoice.discount) }}</td>
      </tr>
      <tr>
        <td colspan="2" class="px-1 py-1 text-right">Total</td>
        <td class="px-1 py-1 text-right">{{ currencyFormat(invoice.total - invoice.discount) }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped></style>
