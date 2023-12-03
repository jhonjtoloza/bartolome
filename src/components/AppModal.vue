<script setup lang="ts">
import { ref } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps({
  title: String
})

const emit = defineEmits(['close'])

const opened = ref(false)

const open = () => {
  opened.value = true
}

const close = () => {
  opened.value = false
  emit('close')
}

defineExpose({
  open,
  close
})
</script>

<template>
  <div class="backdrop-blur bg-gray-800/30 fixed inset-0 z-30" v-if="opened" />
  <div
    v-if="opened"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
  >
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-3xl shadow dark:bg-gray-700 overflow-hidden">
        <button
          @click="close"
          type="button"
          class="absolute top-1 end-2 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <icon-close class="fill-white" />
          <span class="sr-only">Close modal</span>
        </button>
        <div>
          <div class="gap-2 flex items-stretch bg-purple-500 p-2" v-if="props.title">
            <h5 class="ml-4 text-base font-semibold text-white uppercase dark:text-gray-400">
              {{ props.title }}
            </h5>
          </div>
          <div class="p-5">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
