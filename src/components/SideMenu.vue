<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const props = defineProps({
  to: String
})
const { to } = props

const isActive = computed(() => {
  return route.path === to
})
</script>

<template>
  <router-link :to="to!">
    <div class="flex items-center">
      <span
        class="flex items-center justify-center h-12 w-12 rounded-2xl hover:bg-blue-400 text-blue-100"
        :class="{ 'bg-blue-400 text-blue-100': isActive }"
      >
        <slot />
      </span>
    </div>
  </router-link>
</template>

<style scoped></style>
