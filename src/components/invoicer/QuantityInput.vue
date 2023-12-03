<script setup lang="ts">
import AppTitle from '@/components/AppTitle.vue'
import AppButton from '@/components/AppButton.vue'
import { ref } from 'vue'
import AppModal from '@/components/AppModal.vue'

const quantity = ref(1)

const modal = ref()
let reqCallback: Function | null = null
const requestQuantity = (callback: Function) => {
  reqCallback = callback
  modal.value.open()
}

const confirm = () => {
  modal.value.close()
  if (reqCallback) reqCallback(quantity.value)
}

const sum = () => {
  quantity.value++
}

const rest = () => {
  quantity.value--
}

defineExpose({
  requestQuantity
})
</script>

<template>
  <app-modal ref="modal">
    <div>
      <app-title class="p-2">Ingrese una cantidad</app-title>
      <div class="flex w-full mt-2">
        <app-button @click="rest">-</app-button>
        <input class="w-full text-center font-bold" type="number" v-model="quantity" />
        <app-button @click="sum">+</app-button>
      </div>
    </div>
    <div class="mt-5">
      <app-button class="w-full" @click="confirm">Confirmar</app-button>
    </div>
  </app-modal>
</template>

<style scoped></style>
