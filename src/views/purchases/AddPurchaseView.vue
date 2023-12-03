<script setup lang="ts">
import AppCard from '@/components/AppCard.vue'
import { usePurchaseStore } from '@/stores/purchase'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import AppTitle from '@/components/AppTitle.vue'
import AppPicture from '@/components/AppPicture.vue'
import QuantityInput from '@/components/invoicer/QuantityInput.vue'
import { computed, ref } from 'vue'
import type { Product } from '@/database/product'
import QuantityPriceInput from '@/views/purchases/QuantityPriceInput.vue'
import { currencyFormat } from '@/util/currency-format'
import AppButton from '@/components/AppButton.vue'
import IconClose from '@/components/icons/IconClose.vue'
import { toast } from 'vue3-toastify'
import { useLoading } from 'vue3-loading-overlay'
import { CashCollection } from '@/database/cash'

const purchaseStore = usePurchaseStore()
const productStore = useProductStore()
const loader = useLoading()

productStore.loadProducts()

const { products } = storeToRefs(productStore)
const { purchase } = storeToRefs(purchaseStore)

const quantityInput = ref<InstanceType<typeof QuantityInput>>()

const add = async (product: Product) => {
  console.log('add', product)
  const onResponse = (quantity: number, price: number) => {
    if (!quantity || !price) {
      toast('precio y cantidad deben ser mas que cero', {
        autoClose: 3000,
        type: 'error'
      })
      add(product)
      return
    }
    if (!purchase.value) {
      purchaseStore.addPurchase({
        total: price * quantity,
        total_paid: 0,
        date: new Date(),
        products: [
          {
            ...product,
            quantity,
            price,
            total: price * quantity
          }
        ]
      })
    } else {
      const result = purchaseStore.addProduct({
        ...product,
        quantity,
        total: product.price * quantity
      })
      if (!result) {
        toast('No se pudo agregar el producto', {
          autoClose: 3000,
          type: 'error'
        })
      }
    }
  }
  console.log(quantityInput)
  quantityInput.value?.requestQuantity(onResponse)
}

const model = computed({
  get: () => purchase.value,
  set: (value: any) => {
    purchaseStore.updatePurchase(value)
  }
})

const save = async () => {
  if (!purchase.value) {
    return
  }
  loader.show()
  await purchaseStore.savePurchase()
  await CashCollection.insertOne({
    date: new Date(),
    description: `Compra registrada`,
    amount: purchase.value.total * -1,
    type: 'debit'
  })
  loader.hide()
  toast('Guardado con exito', {
    autoClose: 3000
  })
  purchaseStore.clearPurchase()
}

const isValid = computed(() => {
  return purchase.value && purchase.value.products.length > 0
})
</script>

<template>
  <app-card title="Registrar nueva compra">
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-2">
        <app-title class="p-1 mb-1">Productos</app-title>
        <div class="pb-0">
          <div
            class="p-4 flex gap-3 overflow-x-auto space-x-1 shadow-xl rounded-bl-3xl rounded-br-3xl"
          >
            <div
              class="w-24 flex flex-shrink-0 flex-col items-center shadow border p-2 cursor-pointer"
              v-for="product in products"
              :key="product._id!.toString()"
              @click="add(product)"
            >
              <app-picture :src="product.image" />
              <p class="text-center text-[.3em]">{{ product.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1">
        <app-card class="m-0">
          <template #header>
            <app-title class="p-1 mb-1">Carrito</app-title>
          </template>
          <div v-if="purchase">
            <table class="table-auto w-full mt-3">
              <tr class="table-row">
                <th class="border px-4 py-2">Q</th>
                <th class="border px-4 py-2">Producto</th>
                <th class="border px-4 py-2 text-right">Precio</th>
                <th class="border px-4 py-2">Remover</th>
              </tr>
              <tr v-for="(product, index) in purchase.products" :key="product._id!.toString()">
                <td class="border px-4 py-2">{{ product.quantity }}</td>
                <td class="border px-4 py-2">{{ product.name }}</td>
                <td class="border px-4 py-2 text-right">{{ currencyFormat(product.total) }}</td>
                <td class="border px-4 py-2 text-center">
                  <app-button @click="purchaseStore.removeProduct(index)">
                    <icon-close />
                  </app-button>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="border px-4 py-2 text-right">Total</td>
                <td class="border px-4 py-2 text-right">{{ currencyFormat(purchase.total) }}</td>
                <td class="border px-4 py-2 text-center"></td>
              </tr>
            </table>
          </div>
          <div class="text-right pt-2">
            <app-button @click="save" :disabled="!isValid"> Guardar</app-button>
          </div>
        </app-card>
      </div>
    </div>
  </app-card>
  <quantity-price-input ref="quantityInput" />
</template>
