<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import { ref } from 'vue'
import AppModal from '@/components/AppModal.vue'
import AppInput from '@/components/form/AppInput.vue'
import type { Product } from '@/database/product'

const quantity = ref(1)
const price = ref(0)

const modal = ref()
let reqCallback: Function | null = null
const requestQuantity = (callback: Function, product: Product) => {
  price.value = product.cost
  reqCallback = callback
  modal.value.open()
}

const confirm = () => {
  modal.value.close()
  if (reqCallback) reqCallback(quantity.value, price.value)
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
  <app-modal ref="modal" title="Completar informacion">
    <div>
      <div class="mb-2">
        <span class="font-medium text-slate-700 pb-2">Cant.</span>
        <div class="flex w-full mt-2 gap-3">
          <app-button @click="rest">-</app-button>
          <app-input
            id="quantity"
            class="w-full text-center font-bold"
            type="number"
            v-model.number="quantity"
          />
          <app-button @click="sum">+</app-button>
        </div>
      </div>
      <div>
        <app-input
          label="Precio"
          id="price"
          class="w-full text-center font-bold"
          type="number"
          v-model.number="price"
        />
      </div>
    </div>
    <div class="mt-5">
      <app-button class="w-full" @click="confirm">Confirmar</app-button>
    </div>
  </app-modal>
</template>

<style scoped></style>
