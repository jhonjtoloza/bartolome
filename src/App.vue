<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCashStore } from '@/stores/cash'
const cashStore = useCashStore()

cashStore.loadSession()
</script>

<template>
  <router-view />
</template>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
