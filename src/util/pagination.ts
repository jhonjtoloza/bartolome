import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

interface PaginationConfig<T> {
  rowsPerPage?: Ref<number>
  collection: any
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
    const aggregation = []
    if (filter.value) {
      page.value = 1
      aggregation.push({
        $match: filter.value
      })
    }
    aggregation.push(
      ...[
        {
          $skip: (page.value - 1) * rowsPerPage.value
        },
        {
          $limit: rowsPerPage.value
        },
        {
          $sort: {
            date: -1
          }
        }
      ]
    )
    config.collection.aggregate(aggregation).then((data: any) => {
      loading.value = false
      rows.value = data
    })
  }

  watch(
    filter,
    () => {
      console.log(filter.value)
      config.collection.count(filter.value).then((data: any) => {
        console.log(`count: ${data}`)
        total.value = data
      })
    },
    { immediate: true }
  )

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
