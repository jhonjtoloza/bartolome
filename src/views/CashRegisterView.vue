<script setup lang="ts">
import { usePagination } from '@/util/pagination'
import type { Cash } from '@/database/cash'
import { CashCollection } from '@/database/cash'
import { computed, onMounted, ref } from 'vue'
import { currencyFormat } from '@/util/currency-format'
import { dateFormat } from '@/util/date-format'
import AppCard from '@/components/AppCard.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppPagination from '@/components/AppPagination.vue'

const { rows, page, setPage, totalPages, load } = usePagination<Cash>({
  rowsPerPage: ref(20),
  collection: CashCollection
})

const fields = [
  { key: 'date', label: 'Fecha' },
  { key: 'description', label: 'Descripción' },
  { key: 'amount', label: 'Total' }
]

const tableValues = computed(() => {
  return rows.value.map((row) => ({
    date: dateFormat(row.date),
    description: row.description,
    amount: currencyFormat(row.amount)
  }))
})

onMounted(() => {
  load()
})
</script>

<template>
  <app-card title="Caja">
    <app-table :fields="fields" :rows="tableValues" />
    <app-pagination :current-page="page" :total-pages="totalPages" @page-change="setPage" />
  </app-card>
</template>

<style scoped></style>
