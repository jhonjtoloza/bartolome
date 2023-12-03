<script setup lang="ts">
const props = defineProps({
  src: String
})
</script>

<template>
  <div
    class="w-20 h-20 rounded overflow-hidden shadow bg-cover bg-center bg-white"
    :style="{ backgroundImage: `url(${src})` }"
  ></div>
</template>

<style scoped></style>
