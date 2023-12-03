<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: null,
  options: {
    type: Array as () => { label: string; value: any }[],
    default: () => []
  },
  label: {
    type: String,
    default: 'Seleccione'
  }
})

const emit = defineEmits(['update:modelValue'])

const id = Math.random().toString(36).substring(2, 15)
const model = computed({
  get: () => props.modelValue,
  set: (value: any) => {
    console.log(value)
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <label :for="id" class="block text-sm font-medium text-gray-900 dark:text-white"
    >{{ props.label }}
    <select
      v-model="model"
      :id="id"
      class="border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option v-for="option in options" :key="option.label" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped></style>
