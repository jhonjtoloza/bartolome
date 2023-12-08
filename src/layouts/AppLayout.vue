<script setup lang="ts">
import AppAside from '@/components/AppAside.vue'
import { RouterView } from 'vue-router'
import PrintComponent from '@/components/invoicer/PrintComponent.vue'
</script>

<template>
  <div
    class="flex flex-row h-screen text-blue-gray-800 print:w-full print:h-full print:p-0 print:bg-white print:block"
  >
    <AppAside class="print:hidden" />
    <main class="flex-grow flex print:hidden">
      <RouterView />
    </main>
    <print-component />
  </div>
</template>

<style scoped></style>
