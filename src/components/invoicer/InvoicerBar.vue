<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import AppButton from '@/components/AppButton.vue'
import SideModal from '@/components/SideModal.vue'
import { ref, watch } from 'vue'
import AppInput from '@/components/form/AppInput.vue'
import type { Invoice } from '@/database/invoice'
import { useInvoicerStore } from '@/stores/invoicer'
import InvoicerBarItem from '@/components/invoicer/InvoicerBarItem.vue'
import type { BarInvoice } from '@/types/bar-invoice'
import { storeToRefs } from 'pinia'
import IconPlus from '@/components/icons/IconPlus.vue'

const invoicerStore = useInvoicerStore()
const { invoices } = storeToRefs(invoicerStore)
const invoicesBar = ref<BarInvoice[]>([])

const modal = ref()

const model = ref({
  name: '',
  phone: ''
})

const save = () => {
  modal.value.close()
  const invoice: Invoice = {
    customer: {
      name: model.value.name,
      phone: model.value.phone
    },
    products: [],
    total: 0,
    total_paid: 0,
    total_income: 0,
    discount: 0,
    date: new Date().getTime(),
    is_done: false,
    location: 'bar',
    table: null,
    number: 1,
    has_debt: false
  }
  invoicerStore.addInvoice(invoice)
  model.value = {
    name: '',
    phone: ''
  }
  modal.value.close()
}

const open = () => {
  modal.value.open()
}

watch(
  invoices,
  () => {
    invoicesBar.value = invoicerStore.invoices
      .filter((invoice) => invoice.location === 'bar')
      .map((el) => {
        return {
          invoice: el,
          entered: false
        }
      })
  },
  { immediate: true }
)
</script>

<template>
  <app-title class="p-1 px-2"> Barra</app-title>
  <div class="shadow-2xl rounded-br-3xl rounded-bl-3xl flex flex-col flex-shrink-0">
    <div class="p-2.5 flex-1">
      <invoicer-bar-item
        :seat="seat"
        v-for="seat in invoicesBar"
        :key="seat.invoice._id!.toString()"
      />
      <app-button class="ml-auto flex items-center" @click="open">
        <icon-plus class="fill-white" />
        <span class="ml-2">Agregar</span></app-button
      >
    </div>
  </div>

  <side-modal ref="modal">
    <app-input class="mb-3" label="Nombre" v-model="model.name" />
    <app-input class="mb-3" label="Teléfono" v-model="model.phone" />
    <div class="mt-2 text-right">
      <app-button @click="save">Confirmar</app-button>
    </div>
  </side-modal>
</template>

<style scoped></style>
