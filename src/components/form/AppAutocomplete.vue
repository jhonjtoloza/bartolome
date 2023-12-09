<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppInput from '@/components/form/AppInput.vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import AppButton from '@/components/AppButton.vue'
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
  console.log(search.value, selected.value)
  if (selected.value || !search.value) {
    options.value = []
    return
  }
  CustomerModel.db
    .find({
      selector: {
        name: RegExp(search.value)
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
</script>

<template>
  <div class="flex items-end">
    <app-input
      input-class="rounded-none mb-0"
      class="flex-1"
      label="Nombre"
      v-model="search"
      @search="handleSearch"
    />
    <app-button
      v-if="selected"
      @click="clear"
      class="bg-zinc-800 text-white px-2.5 rounded-none h-[42px]"
    >
      <icon-close class="fill-white" />
    </app-button>
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
