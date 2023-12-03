<script setup lang="ts">
import InvoicerProducts from '@/components/invoicer/InvoicerProducts.vue'
import InvoicerTables from '@/components/invoicer/InvoicerTables.vue'
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import InvoicerBar from '@/components/invoicer/InvoicerBar.vue'
import { useInvoicerStore } from '@/stores/invoicer'
import QuantityInput from '@/components/invoicer/QuantityInput.vue'
import AppModal from '@/components/AppModal.vue'
import { storeToRefs } from 'pinia'
import InvoicerComplete from '@/components/invoicer/InvoicerComplete.vue'
import AppCard from '@/components/AppCard.vue'
import { useCashStore } from '@/stores/cash'
import AppInput from '@/components/form/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import { useLoading } from 'vue3-loading-overlay'

const invoicerStore = useInvoicerStore()
const productStore = useProductStore()
const cashStore = useCashStore()

const quantity = ref<InstanceType<typeof AppModal> | null>(null)
const { product } = storeToRefs(invoicerStore)

const isOpen = computed(() => cashStore.session?.status === 'open')

onMounted(() => {
  invoicerStore.loadInvoices()
  productStore.loadProducts()
})

if (product.value) {
  quantity.value?.open()
}

const amount = ref(0)
const modal = ref<InstanceType<typeof AppModal> | null>(null)
const openCash = () => {
  cashStore.openSession(amount.value)
}

onMounted(async () => {
  if (!cashStore.isChecked) {
    await cashStore.loadSession()
  }
  if (!isOpen.value) {
    modal.value?.open()
  }
})

const close = () => {
  modal.value!.open()
}
</script>

<template>
  <app-card>
    <template #header>
      <div class="p-4 gap-2 flex justify-between items-center bg-cyan-500">
        <h5 class="text-base font-semibold text-zinc-100 uppercase dark:text-gray-100">
          Facturacion
        </h5>
        <app-button @click="cashStore.closeSession()" class="bg-purple-500">
          Cerrar caja
        </app-button>
      </div>
    </template>
    <div class="grid grid-cols-6 gap-2">
      <div class="col-span-6 min-h-[6em]">
        <invoicer-products />
      </div>
      <div class="col-span-4">
        <invoicer-tables />
      </div>
      <div class="col-span-2">
        <invoicer-bar />
      </div>
    </div>
    <template v-if="!isOpen">
      <app-modal ref="modal" title="Debe abrir caja" v-if="!isOpen" @close="close">
        <app-input type="number" label="Ingrese un monto" v-model="amount" />
        <div class="mt-3 text-right">
          <app-button @click="openCash">Confirmar</app-button>
        </div>
      </app-modal>
    </template>
  </app-card>
  <invoicer-complete />
</template>
