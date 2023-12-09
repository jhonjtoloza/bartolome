<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Table, TableModel } from '@/database/table'
import AppCard from '@/components/AppCard.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppButton from '@/components/AppButton.vue'
import AppModal from '@/components/AppModal.vue'
import AppInput from '@/components/form/AppInput.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import { storeToRefs } from 'pinia'
import { toast } from 'vue3-toastify'

const invoicerStore = useInvoicerStore()
const { invoices } = storeToRefs(invoicerStore)
const tables = ref<Table[]>([])
const modal = ref<InstanceType<typeof AppModal>>()
const model = ref<Table>({
  name: ''
})

async function load() {
  tables.value = await TableModel.findAll()
}

onMounted(() => {
  load()
})

const fields = [
  { key: 'name', label: 'Mesa' },
  { key: 'actions', label: 'Acciones' }
]

async function remove(table: Table) {
  const hasInvoices = invoices.value.some((invoice) => invoice.table?._id === table._id)
  if (hasInvoices) {
    toast('No se puede borrar una mesa con facturas', {
      type: 'error',
      autoClose: 3000
    })
    return
  }
  await TableModel.db.remove(table as any)
  await load()
}

async function save() {
  await TableModel.insertOne(model.value)
  await load()
  modal.value?.close()
}
</script>

<template>
  <app-card title="Mesas">
    <div class="text-right mb-2">
      <app-button @click="modal?.open()">Nueva mesa</app-button>
    </div>
    <div class="text-right mb-3">
      <app-table :fields="fields" :rows="tables">
        <template #cell(actions)="{ item }">
          <app-button @click="remove(item as Table)">Remover</app-button>
        </template>
      </app-table>
    </div>
  </app-card>
  <app-modal ref="modal" title="Mesa">
    <app-input v-model="model.name" label="Mesa" />
    <div class="pt-4">
      <app-button @click="save">Guardar</app-button>
    </div>
  </app-modal>
</template>

<style scoped></style>
