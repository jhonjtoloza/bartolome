<script setup lang="ts">
import { usePagination } from '@/util/pagination'
import { computed, onMounted, ref } from 'vue'
import type { Invoice } from '@/database/invoice'
import { InvoiceModel } from '@/database/invoice'
import AppSelect from '@/components/form/AppSelect.vue'
import AppInput from '@/components/form/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppPagination from '@/components/AppPagination.vue'
import { currencyFormat } from '@/util/currency-format'
import AppCard from '@/components/AppCard.vue'
import AppTable from '@/components/table/AppTable.vue'
import { dateFormat } from '@/util/date-format'

const pagination = usePagination<Invoice>({
  rowsPerPage: ref(20),
  collection: InvoiceModel.db,
  filter: ref({
    is_done: true
  })
})

const filter = ref({
  is_done: true,
  customer: '',
  has_debt: null
})

const onSubmit = () => {
  const _filter: { [key: string]: any } = {
    is_done: true
  }
  if (filter.value.customer) {
    _filter['customer.name'] = {
      $regex: new RegExp(filter.value.customer, 'i')
    }
  }
  if (filter.value.has_debt) {
    _filter.$expr = {
      $ne: ['$total_paid', '$total']
    }
  }
  pagination.filter.value = _filter
  pagination.load()
}

onMounted(() => {
  pagination.load()
})

const fields = [
  { key: 'date', label: 'Fecha' },
  { key: 'number', label: 'Número' },
  { key: 'customer', label: 'Cliente' },
  { key: 'total', label: 'Total', td_classes: 'text-right' },
  { key: 'discount', label: 'Descuento', td_classes: 'text-right' },
  { key: 'total_paid', label: 'Pagado', td_classes: 'text-right' },
  { key: 'income', label: 'Ganancia', td_classes: 'text-right' },
  { key: 'debt', label: 'Deuda', td_classes: 'text-right' },
  { key: 'actions', label: 'Acciones' }
]
const tableValues = computed(() => {
  return rows.value.map((row) => ({
    _id: row._id,
    number: row.number,
    date: dateFormat(row.date),
    customer: row.customer!.name,
    total: currencyFormat(row.total),
    discount: currencyFormat(row.discount),
    total_paid: currencyFormat(row.total_paid),
    income: currencyFormat(row.total_income),
    debt: currencyFormat(row.total - row.discount - row.total_paid),
    actions: ''
  }))
})

const { rows, totalPages, page, setPage } = pagination
</script>

<template>
  <app-card title="Facturas">
    <form class="grid grid-cols-6 items-end gap-2 my-2" @submit.prevent="onSubmit">
      <app-input
        class="col-span-2"
        label="Buscar por nombre de cliente"
        v-model="filter.customer"
      />
      <app-select
        label="Credito"
        class="col-span-2"
        :options="[
          { label: 'Todas', value: null },
          { label: 'En deuda', value: true },
          { label: 'Pagadas', value: false }
        ]"
        v-model="filter.has_debt"
      />
      <div class="col-span-2 text-right">
        <app-button type="submit">Buscar</app-button>
      </div>
    </form>
    <app-table :fields="fields" :rows="tableValues">
      <template #cell(actions)="{ item }">
        <router-link :to="`/app/invoices/${item._id}`">
          <app-button>Ver</app-button>
        </router-link>
      </template>
    </app-table>
    <app-pagination :current-page="page" :total-pages="totalPages" @page-change="setPage" />
  </app-card>
</template>
