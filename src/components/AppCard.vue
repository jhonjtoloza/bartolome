<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: String,
  bodyClass: String
})

const padding = computed(() => {
  if (props.bodyClass) {
    return
  }
  return 'p-4'
})
</script>

<template>
  <div class="flex flex-col flex-1 m-4 shadow-xl rounded-3xl overflow-hidden">
    <slot name="header">
      <div class="p-4 gap-2 flex justify-between items-center bg-blue-800">
        <h5 class="text-base font-semibold text-zinc-100 uppercase dark:text-gray-100">
          {{ props.title }}
        </h5>
      </div>
    </slot>
    <div :class="[props.bodyClass, padding]" class="bg-white flex-1 overflow-y-scroll">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
