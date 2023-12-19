<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppInput from '@/components/form/AppInput.vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps<{
  modelValue: string | null
}>()

const search = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})
const selected = ref<Customer | null>(null)
const options = ref<Customer[]>([])

const handleSearch = () => {
  if (selected.value || !search.value) {
    options.value = []
    return
  }
  console.log(`.*[${search.value.toUpperCase()}|${search.value.toLowerCase()}].*`)
  CustomerModel.db
    .find({
      selector: {
        name: {
          $regex: `.*${search.value.toUpperCase()}|${search.value.toLowerCase()}.*`
        }
      }
    })
    .then((data) => {
      options.value = data.docs as unknown as Customer[]
    })
}

let timer: ReturnType<typeof setTimeout>
watch(search, () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => handleSearch(), 500)
})

const emit = defineEmits({
  onSelect: (option: Customer) => true,
  onClear: () => true,
  'update:modelValue': (value: string) => true
})

const onSelect = (option: Customer) => {
  search.value = option.name
  options.value = []
  selected.value = option
  emit('onSelect', option)
}

const clear = () => {
  search.value = ''
  selected.value = null
  options.value = []
  emit('onClear')
}

const setCustomer = (value: Customer | null) => {
  selected.value = value
}

defineExpose({
  setCustomer
})
</script>

<template>
  <div>
    <div class="relative">
      <div class="absolute inset-y-10 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <app-input
        :disabled="!!selected"
        label="Cliente"
        class="flex-1"
        v-model="search"
        @search="handleSearch"
        input-class="ps-8"
        placeholder="Buscar cliente"
      />
      <button
        v-if="selected"
        @click="clear"
        class="text-white absolute end-0 bottom-0 group font-medium rounded-lg text-sm px-4 py-2"
      >
        <icon-close class="fill-black group-hover:fill-red-700" />
      </button>
    </div>
  </div>
  <div class="relative">
    <ul
      v-if="options.length"
      class="absolute top-0 left-0 bg-slate-50 z-10 w-full p-2 shadow border border-slate-200 max-h-80 overflow-y-scroll"
    >
      <li
        v-for="customer in options"
        :key="customer._id!.toString()"
        class="border-b border-slate-200 hover:bg-slate-100 hover:border-gray-700 cursor-pointer px-2.5 py-2"
        @click="onSelect(customer)"
      >
        {{ customer.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
