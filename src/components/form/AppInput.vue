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
  },
  placeholder: {
    type: String
  },
  disabled: {
    type: Boolean
  }
})
</script>

<template>
  <div>
    <label :for="id">
      <span class="font-medium text-slate-700 pb-2">{{ props.label }}</span>
      <input
        :id="id"
        :type="props.type"
        v-model="model"
        :name="id"
        :class="props.inputClass"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        class="h-8 w-full bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none py-1 border border-slate-300 disabled:bg-gray-200"
      />
    </label>
  </div>
</template>

<style scoped></style>
