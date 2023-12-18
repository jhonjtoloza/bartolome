<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, toRefs } from 'vue'
import tableIcon from '@/assets/table.png'
import { currencyFormat } from '@/util/currency-format'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/AppCard.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import QuantityInput from '@/components/invoicer/QuantityInput.vue'
import type { TableInvoicer } from '@/types/table-invoicer'
import AppButton from '@/components/AppButton.vue'
import IconInvoice from '@/components/icons/IconInvoice.vue'

const invoicerStore = useInvoicerStore()
const { product } = storeToRefs(invoicerStore)

const props = defineProps({
  table: {
    type: Object as () => TableInvoicer,
    required: true
  }
})

const { table } = toRefs(props) as unknown as { table: Ref<TableInvoicer> }
const quantityInput = ref()

const onDrop = () => {
  const onResponse = (quantity: number) => {
    table.value.entered = false
    if (!product.value) {
      return
    }
    if (!table.value.invoice) {
      invoicerStore
        .addInvoice({
          number: 1,
          total: product.value.price * quantity,
          total_paid: 0,
          total_income: (product.value.price - product.value.cost) * quantity,
          products: [
            {
              ...product.value,
              quantity: quantity,
              total: product.value.price * quantity,
              income: (product.value.price - product.value.cost) * quantity
            }
          ],
          has_debt: false,
          is_done: false,
          location: 'table',
          discount: 0,
          table: {
            _id: table.value._id!,
            name: table.value.name
          },
          customer: null,
          date: new Date().getTime()
        })
        .then((invoice) => {
          table.value.invoice = invoice
        })
    } else {
      invoicerStore
        .addProduct(table.value!.invoice, {
          ...product.value,
          quantity,
          total: product.value.price * quantity,
          income: (product.value.price - product.value.cost) * quantity
        })
        .then((invoice) => {
          table.value.invoice = invoice
        })
    }
  }

  quantityInput.value.requestQuantity(onResponse)
}
const onDragEnter = () => {
  table.value.entered = true
}

const onDragLeave = () => {
  table.value.entered = false
}

const finish = () => {
  invoicerStore.setInvoice(table.value.invoice!)
}
</script>

<template>
  <app-card body-class="p-0">
    <template #header>
      <div class="p-1 flex justify-center bg-zinc-200 rounded-tl rounded-tr">
        <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          {{ table.name }}
        </h5>
      </div>
    </template>
    <div
      :class="[
        {
          'bg-zinc-200': table.entered
        },
        table.invoice && !table.entered ? 'bg-green-200' : ''
      ]"
      @drop="onDrop"
      @dragover.prevent
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      class="flex flex-col items-center overflow-hidden py-3.5 rounded relative"
    >
      <div class="pointer-events-none">
        <img class="w-20 h-20" :src="tableIcon" alt="none" />
        <p>{{ table.name }}</p>
        <template v-if="table.invoice">
          <p>{{ currencyFormat(table.invoice.total) }}</p>
        </template>
      </div>
      <template v-if="table.invoice">
        <div class="absolute right-1.5 top-1.5">
          <app-button class="bg-blue-100" @click="finish">
            <icon-invoice class="fill-amber-50" />
          </app-button>
        </div>
      </template>
    </div>
  </app-card>
  <quantity-input ref="quantityInput" />
</template>

<style scoped></style>
