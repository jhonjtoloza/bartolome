<script setup lang="ts">
import { computed } from 'vue'

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const emit = defineEmits(['update:modelValue'])

const id = Math.random().toString(36).substring(2, 15)
const props = defineProps({
  modelValue: {
    type: [Number, String]
  },
  label: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
  },
  inputClass: {
    type: String
  }
})
</script>

<template>
  <label :for="id">
    <span class="font-medium text-slate-700 pb-2">{{ props.label }}</span>
    <input
      :id="id"
      :type="props.type"
      v-model="model"
      :name="id"
      :class="props.inputClass"
      class="w-full py-2 border border-slate-200 px-2 focus:outline-none focus:border-slate-500 hover:shadow"
    />
  </label>
</template>

<style scoped></style>
