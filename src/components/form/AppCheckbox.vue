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
  <div class="flex items-center pe-4 rounded-2xl">
    <label :for="id" class="w-full py-2 ms-2 text-sm font-medium text-gray-900">
      <slot />
    </label>
    <input
      :id="id"
      type="checkbox"
      v-model="model"
      name="bordered-checkbox"
      class="w-6 h-6 text-blue-600 bg-blue-100 border-blue-300 rounded accent-blue-950 focus:ring-zinc-500 focus:ring-5"
    />
  </div>
</template>

<style scoped></style>
