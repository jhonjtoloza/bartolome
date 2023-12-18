<script setup lang="ts">
import { usePagination } from '@/util/pagination'
import { type CashSession, CashSessionModel } from '@/database/cash-session'
import { computed, onMounted, ref } from 'vue'
import AppTable from '@/components/table/AppTable.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppCard from '@/components/AppCard.vue'
import { dateFormat } from '@/util/date-format'
import { currencyFormat } from '@/util/currency-format'
import AppButton from '@/components/AppButton.vue'

const { rows, page, setPage, totalPages, load } = usePagination<CashSession>({
  rowsPerPage: ref(20),
  collection: CashSessionModel.db
  // filter: ref({
  //   status: 'closed'
  // })
})

const fields = [
  { key: 'start', label: 'Desde' },
  { key: 'end', label: 'Hasta' },
  { key: 'cash_opened', label: 'Apertura' },
  { key: 'cash_closed', label: 'Cierre' },
  { key: 'total_debt', label: 'Deuda' },
  { key: 'total_paid', label: 'Pagado' },
  { key: 'total_invoices', label: 'Facturas' },
  { key: 'total_purchases', label: 'Compras' },
  { key: 'total_discount', label: 'Descuentos' },
  { key: 'total_income', label: 'Ingresos' },
  { key: 'action', label: 'Acciones' }
]

const tableValues = computed(() => {
  return rows.value.map((row) => ({
    start: dateFormat(row.start),
    end: dateFormat(row.end),
    cash_opened: currencyFormat(row.cash_opened),
    cash_closed: currencyFormat(row.cash_closed),
    total_debt: currencyFormat(row.total_debt),
    total_paid: currencyFormat(row.total_paid),
    total_invoices: currencyFormat(row.total_invoices),
    total_purchases: currencyFormat(row.total_purchases),
    total_discount: currencyFormat(row.total_discount),
    total_income: currencyFormat(row.total_income)
  }))
})

onMounted(() => {
  load()
})
</script>

<template>
  <app-card title="Caja">
    <app-table :fields="fields" :rows="tableValues">
      <template #cell(action)="{ item }">
        <router-link :to="`/cash-sessions/${item._id}`">
          <app-button>Ver</app-button>
        </router-link>
      </template>
    </app-table>
    <app-pagination :current-page="page" :total-pages="totalPages" @page-change="setPage" />
  </app-card>
</template>
