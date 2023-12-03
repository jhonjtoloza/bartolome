<script setup lang="ts">
import AppCard from '@/components/AppCard.vue'
import { usePagination } from '@/util/pagination'
import { computed, onMounted, ref } from 'vue'
import type { Purchase } from '@/database/purchase'
import { PurchaseCollection } from '@/database/purchase'
import AppButton from '@/components/AppButton.vue'
import AppTable from '@/components/table/AppTable.vue'
import AppPagination from '@/components/AppPagination.vue'
import { currencyFormat } from '@/util/currency-format'
import { dateFormat } from '@/util/date-format'

const { rows, totalPages, page, setPage, load } = usePagination<Purchase>({
  rowsPerPage: ref(20),
  collection: PurchaseCollection
})

const fields = [
  { key: 'date', label: 'Fecha' },
  { key: 'total', label: 'Total' },
  { key: 'bought', label: 'Comprado' },
  { key: 'actions', label: 'Acciones' }
]

const tableValues = computed(() => {
  return rows.value.map((row) => ({
    date: dateFormat(row.date),
    bought: row.products.map((product) => product.name).join(', '),
    total: currencyFormat(row.total)
  }))
})

onMounted(() => {
  load()
})
</script>

<template>
  <app-card title="Compras">
    <div class="text-right mb-3">
      <router-link to="purchases/add">
        <app-button>Agregar</app-button>
      </router-link>
    </div>
    <app-table :fields="fields" :rows="tableValues">
      <template #cell(actions)="{ item }">
        <router-link :to="`/purchases/${item._id}`">
          <app-button>Ver</app-button>
        </router-link>
      </template>
    </app-table>
    <app-pagination :current-page="page" :total-pages="totalPages" @page-change="setPage" />
  </app-card>
</template>
