<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import AppPicture from '@/components/AppPicture.vue'
import { onMounted } from 'vue'
import type { Product } from '@/database/product'
import AppTitle from '@/components/AppTitle.vue'
import { useInvoicerStore } from '@/stores/invoicer'

const productStore = useProductStore()
const invoicerStore = useInvoicerStore()

const { products } = storeToRefs(productStore)

const onDragEnd = (product: Product) => {
  invoicerStore.setDragging(product)
}
</script>

<template>
  <app-title class="p-1 mb-1">Productos</app-title>
  <div class="pb-0">
    <div class="p-4 flex gap-3 overflow-x-auto space-x-1 shadow-xl rounded-bl-3xl rounded-br-3xl">
      <div
        draggable="true"
        class="w-24 flex flex-shrink-0 flex-col items-center shadow border p-2 cursor-move"
        v-for="product in products"
        :key="product._id.toString()"
        @dragend="onDragEnd(product)"
      >
        <app-picture :src="product.image" />
        <p class="text-center text-[.3em]">{{ product.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
