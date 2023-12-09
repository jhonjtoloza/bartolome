<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import { usePagination } from '@/util/pagination'
import AppInput from '@/components/form/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppSelect from '@/components/form/AppSelect.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppCard from '@/components/AppCard.vue'
import AppTable from '@/components/table/AppTable.vue'

const pagination = usePagination<Customer>({
  rowsPerPage: ref(20),
  collection: CustomerModel.db
})

const filter = ref({
  name: '',
  has_debt: null
})

const onSubmit = () => {
  const _filter: { [key: string]: any } = {}
  if (filter.value.name) {
    _filter.name = {
      $regex: `^.*${filter.value.name}.*$`
    }
  }
  if (filter.value.has_debt !== null) {
    _filter.has_debt = filter.value.has_debt
  }
  pagination.filter.value = _filter
  pagination.load()
}

onMounted(() => {
  pagination.load()
})

const { rows, totalPages, page, setPage, total } = pagination

const fields = [
  { key: 'name', label: 'Nombre' },
  { key: 'phone', label: 'Telefono' },
  { key: 'has_debt', label: 'Tiene deuda' },
  { key: 'actions', label: 'Acciones' }
]

const tableValues = computed(() => {
  return rows.value.map((row) => ({
    _id: row._id,
    name: row.name,
    phone: row.phone,
    has_debt: row.has_debt ? 'Si' : 'No'
  }))
})
</script>

<template>
  <app-card :title="`Clientes (${total})`">
    <div>
      <h1 class="text-3xl">Clientes</h1>
      <form class="grid grid-cols-6 items-end gap-2 my-2" @submit.prevent="onSubmit">
        <app-input class="col-span-2" label="Buscar por nombre" v-model="filter.name" />
        <app-select
          class="col-span-2"
          :options="[
            { label: 'Todas', value: null },
            { label: 'Tiene deuda', value: true },
            { label: 'No tiene deuda', value: false }
          ]"
          v-model="filter.has_debt"
        />
        <div class="col-span-2 text-right">
          <app-button type="submit">Buscar</app-button>
        </div>
      </form>
      <app-table :fields="fields" :rows="tableValues">
        <template #cell(actions)="{ item }">
          <router-link :to="{ name: 'customer', params: { id: item._id!.toString() } }">
            <app-button type="button">Ver</app-button>
          </router-link>
        </template>
      </app-table>
      <app-pagination :current-page="page" :total-pages="totalPages" @page-change="setPage" />
    </div>
  </app-card>
</template>

<style scoped></style>
