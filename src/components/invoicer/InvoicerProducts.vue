<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import AppPicture from '@/components/AppPicture.vue'
import type { Product } from '@/database/product'
import AppTitle from '@/components/AppTitle.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import { currencyFormat } from '@/util/currency-format'
import { computed, onMounted, ref } from 'vue'
import AppInput from '@/components/form/AppInput.vue'

const productStore = useProductStore()
const invoicerStore = useInvoicerStore()

const { products } = storeToRefs(productStore)
const { invoice } = storeToRefs(invoicerStore)
const filter = ref('')

const onDragEnd = (product: Product) => {
  invoicerStore.setDragging(product)
}
const addProduct = async (model: Product) => {
  if (!invoice.value) {
    return
  }
  const product = {
    ...model,
    quantity: 1,
    total: model.price
  }
  await invoicerStore.addProduct(invoice.value, product)
}

const productsFiltered = computed<Product[]>(() => {
  return products.value.filter((product) => {
    if (!filter.value) {
      return true
    }
    return product.name.toLowerCase().includes(filter.value.toLowerCase())
  })
})

const read = ref()
const height = ref(0)

onMounted(() => {
  read.value = window.setInterval(() => {
    height.value = (document.querySelector('#invoicer .bg-white')?.clientHeight || 0) - 150
    if (height.value > 0) {
      window.clearInterval(read.value)
    }
  })
})
</script>

<template>
  <app-title>Productos</app-title>
  <div class="flex-grow shadow-2xl p-3 rounded-2xl overflow-hidden">
    <div class="relative mb-2">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <app-input v-model="filter" input-class="ps-8" placeholder="Buscar producto" />
    </div>
    <div class="overflow-y-scroll" :style="{ height: height + 'px' }">
      <div class="grid gap-2" :class="[invoice ? 'grid-cols-5' : 'grid-cols-1']">
        <div
          draggable="true"
          class="w-34 shadow border p-2 cursor-move flex items-center justify-center gap-2"
          v-for="product in productsFiltered"
          :key="product._id!.toString()"
          @dragend="onDragEnd(product)"
          @click="addProduct(product)"
        >
          <app-picture :src="product.image" class="mb-2" />
          <div>
            <p class="text-center text-[.3em] mb-1">{{ product.name }}</p>
            <p class="text-center text-[.3em]">{{ currencyFormat(product.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
