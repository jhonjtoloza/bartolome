<script setup lang="ts">
import InvoicerProducts from '@/components/invoicer/InvoicerProducts.vue'
import InvoicerTables from '@/components/invoicer/InvoicerTables.vue'
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import InvoicerBar from '@/components/invoicer/InvoicerBar.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import QuantityInput from '@/components/invoicer/QuantityInput.vue'
import AppModal from '@/components/AppModal.vue'
import { storeToRefs } from 'pinia'
import InvoicerComplete from '@/components/invoicer/InvoicerComplete.vue'

const invoicerStore = useInvoicerStore()
const productStore = useProductStore()

const quantity = ref<InstanceType<typeof AppModal> | null>(null)
const { product } = storeToRefs(invoicerStore)

onMounted(() => {
  invoicerStore.loadInvoices()
  productStore.loadProducts()
})

if (product.value) {
  quantity.value?.open()
}
</script>

<template>
  <div id="invoice">
    <div class="[grid-area:products] min-h-[6em]">
      <invoicer-products />
    </div>
    <div class="[grid-area:table]">
      <invoicer-tables />
    </div>
    <div class="[grid-area:bar]">
      <invoicer-bar />
    </div>
  </div>
  <invoicer-complete />
</template>
<style>
#invoice {
  display: grid;
  gap: 1em;
  grid-template-areas:
    'products products'
    'table bar';
  grid-template-columns: 1fr 1fr;
}
</style>
