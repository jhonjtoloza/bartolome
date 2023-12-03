<script setup lang="ts">
import { computed, toRef, toRefs } from 'vue'

type TableField = {
  key: String
  label: String
}

type TableRow = {
  [key: string]: any
}
const props = defineProps({
  fields: {
    type: Array as () => TableField[],
    default: () => []
  },
  rows: {
    type: Array as () => TableRow[],
    default: () => []
  }
})

const displayedFieldKeys = computed(() => {
  return Object.entries(props.fields).map(([_key, value]) => value.key)
})

const { fields, rows } = toRefs(props)
</script>
<template>
  <div>
    <div class="relative overflow-x-auto">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border"
        >
          <tr>
            <th scope="col" class="px-6 py-3" v-for="column in fields">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b border-l border-r dark:bg-gray-800 dark:border-gray-700"
            v-for="item in rows"
            :key="item.id"
          >
            <td class="px-6 py-4" v-for="key in displayedFieldKeys">
              <slot :name="`cell(${key})`" :value="item[key as any]" :item="item">
                {{ item[key as any] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
