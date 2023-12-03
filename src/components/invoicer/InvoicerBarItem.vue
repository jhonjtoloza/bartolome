<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, toRefs } from 'vue'
import type { BarInvoice } from '@/types/bar-invoice'
import QuantityInput from '@/components/invoicer/QuantityInput.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import { storeToRefs } from 'pinia'
import { currencyFormat } from '@/util/currency-format'
import AppButton from '@/components/AppButton.vue'
import IconInvoice from '@/components/icons/IconInvoice.vue'
import IconClose from '@/components/icons/IconClose.vue'

const invoicerStore = useInvoicerStore()
const { product } = storeToRefs(invoicerStore)

const props = defineProps({
  seat: {
    type: Object as () => BarInvoice,
    required: true
  }
})

const { seat } = toRefs(props) as unknown as { seat: Ref<BarInvoice> }
const quantityInput = ref()

const onDrop = () => {
  const onResponse = (quantity: number) => {
    console.log(quantity)
    seat.value.entered = false
    console.log(seat.value)
    if (!product.value) {
      return
    }
    invoicerStore
      .addProduct(seat.value!.invoice, {
        ...product.value,
        quantity,
        total: product.value.price * quantity
      })
      .then((invoice) => {
        seat.value.invoice = invoice
      })
  }

  quantityInput.value.requestQuantity(onResponse)
}

const deleteInvoice = () => {
  invoicerStore.deleteInvoice(seat.value!.invoice)
}

const onDragEnter = () => {
  seat.value.entered = true
  console.log(seat.value)
}

const onDragLeave = () => {
  seat.value.entered = false
  console.log(seat.value)
}

const finish = () => {
  invoicerStore.setInvoice(seat.value.invoice)
}
</script>

<template>
  <div
    class="w-full rounded-xl border-t border-cyan-500 overflow-hidden shadow-md my-4 p-3 flex items-center"
    :class="{
      'bg-zinc-100': seat.entered
    }"
    @drop="onDrop"
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
  >
    <div class="pointer-events-none flex flex-1 mr-2 justify-between items-center">
      <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
        {{ seat.invoice.customer!.name }} ({{ seat.invoice.customer!.phone }})
      </h5>
      <span class="items-end text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
        {{ currencyFormat(seat.invoice.total) }}
      </span>
    </div>
    <app-button class="bg-zinc-300 h-10" @click="finish" title="Facturar">
      <icon-invoice />
    </app-button>
    <app-button
      v-if="seat.invoice.total === 0"
      title="Borrar"
      class="bg-zinc-800 ml-2 h-10"
      @click="deleteInvoice"
    >
      <icon-close />
    </app-button>
  </div>
  <quantity-input ref="quantityInput" />
</template>
