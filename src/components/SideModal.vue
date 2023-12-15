<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  title: String,
  backdrop: {
    type: Boolean,
    default: true
  }
})

const opened = ref(false)

const emit = defineEmits(['close'])

const close = () => {
  opened.value = false
  emit('close')
}

const open = () => {
  opened.value = true
}

defineExpose({
  open,
  close
})
</script>

<template>
  <div
    class="backdrop-blur bg-gray-800/30 fixed inset-0 z-30"
    v-if="opened && backdrop"
    @click="close"
  />
  <div
    v-if="opened"
    class="fixed top-0 right-0 z-40 w-1/3 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 shadow-2xl"
    :class="[opened ? 'translate-x-0' : 'translate-x-full']"
  >
    <h5
      id="drawer-navigation-label"
      class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      {{ props.title }}
    </h5>
    <button
      @click="close"
      type="button"
      data-drawer-hide="drawer-navigation"
      aria-controls="drawer-navigation"
      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span class="sr-only">Close menu</span>
    </button>
    <div class="py-4">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
