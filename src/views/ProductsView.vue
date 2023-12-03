<script setup lang="ts">
import SideModal from '@/components/SideModal.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import AppCard from '@/components/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import FormProduct from '@/components/producs/FormProduct.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import type { Product } from '@/database/product'
import { currencyFormat } from '@/util/currency-format'
import AppPicture from '@/components/AppPicture.vue'
import AppTable from '@/components/table/AppTable.vue'

const productStore = useProductStore()

const { products } = storeToRefs(productStore)

onMounted(() => {
  productStore.loadProducts()
})

const modal = ref()
const form = ref()

const edit = (product: Product) => {
  modal.value.open()
  nextTick(() => {
    if (!form.value) return
    form.value.edit(product)
  })
}

const fields = [
  { key: 'image', label: 'Imagen' },
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nombre' },
  { key: 'price', label: 'Precio' },
  { key: 'description', label: 'Descripción' },
  { key: 'stock', label: 'Stock' },
  {
    key: 'actions',
    label: 'Acciones'
  }
]

const values = computed(() => {
  return products.value.map((product) => {
    return {
      _id: product._id,
      code: product.code,
      image: product.image,
      name: product.name,
      price: currencyFormat(product.price),
      description: product.description,
      stock: product.stock
    }
  })
})
</script>

<template>
  <app-card>
    <template #header>
      <div class="p-4 gap-2 flex justify-between items-center bg-cyan-500">
        <h5 class="text-base font-semibold text-zinc-100 uppercase dark:text-gray-100">
          Productos
        </h5>
      </div>
    </template>
    <div class="text-right mb-3">
      <app-button @click="modal.open()">Agregar</app-button>
    </div>
    <app-table :fields="fields" :rows="values">
      <template #cell(image)="{ item }">
        <app-picture :src="item.image" />
      </template>
      <template #cell(actions)="{ item }">
        <app-button @click="edit(item as Product)">Editar</app-button>
      </template>
    </app-table>
  </app-card>
  <side-modal title="Agregar producto" ref="modal">
    <form-product ref="form" />
  </side-modal>
</template>

<style scoped></style>
