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
  <label :for="id">
    <span class="font-medium text-slate-700 pb-2">{{ props.label }}</span>
    <select
      v-model="model"
      :id="id"
      class="h-8 w-full bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none py-1 border border-slate-300 disabled:bg-gray-200"
    >
      <option v-for="option in options" :key="option.label" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped></style>
