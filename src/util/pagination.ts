import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import PouchDB from 'pouchdb'

interface PaginationConfig<T> {
  rowsPerPage?: Ref<number>
  collection: PouchDB.Database<T | any>
  filter?: Ref
}

export function usePagination<T>(config: PaginationConfig<T>) {
  const loading = ref(false)

  const rowsPerPage = config.rowsPerPage || ref(100)
  const rows = ref<T[]>([])
  const filter = config.filter || ref({})

  const total = ref(0)
  const page = ref(1)

  const totalPages = computed(() => Math.ceil(total.value / rowsPerPage.value))
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPreviousPage = computed(() => page.value > 1)

  const load = async () => {
    loading.value = true
    const selector = Object.keys(filter.value).length ? filter.value : {}
    console.log(`selector`, JSON.stringify(selector))
    config.collection
      .find({
        selector,
        skip: (page.value - 1) * rowsPerPage.value,
        limit: rowsPerPage.value
      })
      .then((data) => {
        console.log(`data`, data)
        loading.value = false
        rows.value = data.docs
      })
  }

  watch(filter, () => {}, { immediate: true })

  const setPage = (pageNumber: number) => {
    page.value = pageNumber
    load()
  }

  return {
    rows,
    rowsPerPage,
    filter,
    loading,
    total,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage,
    load
  }
}

export type Pagination = ReturnType<typeof usePagination>
