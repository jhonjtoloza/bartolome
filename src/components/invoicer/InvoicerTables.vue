<script setup lang="ts">
import { ref, watch } from 'vue'
import { TableModel } from '@/database/table'
import type { Invoice } from '@/database/invoice'
import { storeToRefs } from 'pinia'
import InvoicerTable from '@/components/invoicer/InvoicerTable.vue'
import AppTitle from '@/components/AppTitle.vue'
import AppModal from '@/components/AppModal.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import type { TableInvoicer } from '@/types/table-invoicer'

const tables = ref<TableInvoicer[]>([])
const invoicerStore = useInvoicerStore()

const { invoices } = storeToRefs(invoicerStore)

const loadTables = async () => {
  TableModel.findAll().then((data) => {
    tables.value = data.map((table) => ({
      invoice: invoices.value.find((invoice) => invoice.table?._id === table._id) as Invoice | null,
      entered: false,
      used: false,
      ...table
    }))
  })
}

watch(
  invoices,
  () => {
    loadTables()
  },
  { immediate: true }
)
</script>

<template>
  <app-title class="p-1 px-2"> Mesas</app-title>
  <div class="shadow-2xl rounded-br-3xl rounded-bl-3xl">
    <div class="grid grid-cols-3 gap-1 overflow-y-auto">
      <invoicer-table :table="table" v-for="table in tables" :key="table._id" />
    </div>
  </div>
  <app-modal> hello</app-modal>
</template>
