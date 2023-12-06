<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/components/form/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import type { Product } from '@/database/product'
import { useProductStore } from '@/stores/product'
import { ObjectId } from '@/database/connection'

const productStore = useProductStore()

const model = ref<Product>({
  code: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: ''
})

const save = () => {
  productStore
    .saveProduct(model.value)
    .then(() => {
      model.value = {
        code: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: ''
      }
    })
    .catch(console.error)
}

const edit = (product: Product) => {
  model.value = product
}

defineExpose({
  edit
})
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="save">
    <app-input label="Código" v-model="model.code" />
    <app-input label="Nombre" v-model="model.name" />
    <app-input label="Descripción" v-model="model.description" />
    <app-input label="Precio" v-model.number="model.price" />
    <app-input label="Stock" v-model.number="model.stock" />
    <app-input label="Imagen" v-model="model.image" />
    <div class="text-right">
      <app-button type="submit">Guardar</app-button>
    </div>
  </form>
</template>

<style scoped></style>
