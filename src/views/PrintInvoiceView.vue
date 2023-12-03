<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Invoice } from '@/database/invoice'
import { InvoiceCollection } from '@/database/invoice'
import { currencyFormat } from '@/util/currency-format'
import { ObjectId } from '@/database/connection'

const { id } = useRoute().params

const invoice = ref<Invoice>()

onMounted(() => {
  InvoiceCollection.findOne({ _id: new ObjectId(id as string) }).then((data) => {
    invoice.value = data
    console.log(data)
    // window.print()
  })
})
</script>

<template>
  <div>
    <div v-if="invoice">
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
        <tr v-for="product in invoice.products" :key="product._id.toString()">
          <td class="border-b px-1 py-1">{{ product.quantity }}</td>
          <td class="border-b px-1 py-1">{{ product.name }}</td>
          <td class="border-b px-1 py-1 text-right">{{ currencyFormat(product.price) }}</td>
        </tr>
        <tr>
          <td colspan="2" class="px-1 py-1 text-right">Total</td>
          <td class="px-1 py-1 text-right">{{ currencyFormat(invoice.total) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
