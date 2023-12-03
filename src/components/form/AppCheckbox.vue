<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

import { computed } from 'vue'

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const emit = defineEmits(['update:modelValue'])

const id = Math.random().toString(36).substring(2, 15)
</script>

<template>
  <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
    <input
      :id="id"
      type="checkbox"
      v-model="model"
      name="bordered-checkbox"
      class="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded accent-zinc-950 focus:ring-zinc-500 dark:focus:ring-zinc-600 dark:ring-offset-gray-800 focus:ring-5 dark:bg-gray-700 dark:border-gray-600"
    />
    <label :for="id" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      <slot />
    </label>
  </div>
</template>

<style scoped></style>
