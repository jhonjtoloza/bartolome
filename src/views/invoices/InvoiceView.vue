<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { type Invoice, InvoiceModel } from '@/database/invoice'
import { onMounted, ref } from 'vue'
import AppCard from '@/components/AppCard.vue'
import { dateFormat } from '../../util/date-format'
import { currencyFormat } from '../../util/currency-format'
import AppPicture from '@/components/AppPicture.vue'

const { id } = useRoute().params
const invoice = ref<Invoice>()

if (!id) {
  useRouter().push({ name: '/app/invoices' })
}

const load = async () => {
  invoice.value = await InvoiceModel.findOne(id as string)
}

onMounted(() => {
  load()
})
</script>

<template>
  <app-card v-if="invoice" :title="`Factura ${invoice?.number}`">
    <div class="grid grid-cols-3">
      <div class="col-span-1">
        <app-card title="Detalles">
          <table class="w-full">
            <tr>
              <th class="border border-gray-300 p-2">
                <strong>Cliente:</strong>
              </th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ invoice.customer!.name }}
              </td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-2">
                <strong>Fecha:</strong>
              </th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ dateFormat(invoice.date) }}
              </td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-2"><strong>Total:</strong></th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ currencyFormat(invoice.total) }}
              </td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-2"><strong>Descuento:</strong></th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ currencyFormat(invoice.discount) }}
              </td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-2"><strong>Total pagado</strong></th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ currencyFormat(invoice.total_paid) }}
              </td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-2"><strong>Ganancia</strong></th>
              <td class="border-b border-r border-t border-gray-300 p-2">
                {{ currencyFormat(invoice.total_income) }}
              </td>
            </tr>
          </table>
        </app-card>
      </div>
      <div class="col-span-2">
        <app-card title="Productos facturados">
          <table class="w-full">
            <tr>
              <th class="border border-gray-300 p-2"><strong>Imagen</strong></th>
              <th class="border border-gray-300 p-2"><strong>Descripción</strong></th>
              <th class="border border-gray-300 p-2"><strong>Cantidad</strong></th>
              <th class="border border-gray-300 p-2"><strong>Precio</strong></th>
              <th class="border border-gray-300 p-2"><strong>Total</strong></th>
            </tr>
            <tr v-for="product in invoice.products" :key="product._id">
              <td class="border border-gray-300 p-2 flex justify-center">
                <app-picture :src="product.image" />
              </td>
              <td class="border border-gray-300 p-2">{{ product.name }}</td>
              <td class="border border-gray-300 p-2">{{ product.quantity }}</td>
              <td class="border border-gray-300 p-2">{{ currencyFormat(product.price) }}</td>
              <td class="border border-gray-300 p-2">
                {{ currencyFormat(product.quantity * product.price) }}
              </td>
            </tr>
          </table>
        </app-card>
      </div>
    </div>
  </app-card>
</template>

<style scoped></style>
