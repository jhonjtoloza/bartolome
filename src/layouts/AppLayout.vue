<script setup lang="ts">
import AppAside from '@/components/AppAside.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="hide-print flex flex-row h-screen antialiased text-blue-gray-800">
    <AppAside />
    <main class="flex-grow flex">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
