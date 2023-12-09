<script setup lang="ts">
import { useInvoicerStore } from '@/stores/invoicer'
import { storeToRefs } from 'pinia'
import SideModal from '@/components/SideModal.vue'
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/form/AppInput.vue'
import AppAutocomplete from '@/components/form/AppAutocomplete.vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import { currencyFormat } from '@/util/currency-format'
import AppCheckbox from '@/components/form/AppCheckbox.vue'
import { type Product, ProductModel } from '@/database/product'
import { useCashStore } from '@/stores/cash'
import { useLoading } from 'vue3-loading-overlay'

const invoicerStore = useInvoicerStore()
const cashStore = useCashStore()
const loader = useLoading()

const { invoice } = storeToRefs(invoicerStore)
const modal = ref()

const save = async () => {
  if (!invoice.value) {
    return
  }

  loader.show()
  if (!customer.value._id) {
    customer.value._id = (
      await CustomerModel.insertOne({
        name: customer.value.name,
        phone: customer.value.phone
      })
    ).id
  }
  if (options.value.credit) {
    CustomerModel.db.get<Customer>(customer.value._id!).then((dbCustomer) => {
      dbCustomer.has_debt = true
      return CustomerModel.db.put(dbCustomer)
    })
  }
  invoice.value.number = await invoicerStore.getNextInvoiceNumber()
  invoice.value.customer = customer.value
  invoice.value.total_paid = !options.value.credit ? invoice.value.total : invoice.value.total_paid
  invoice.value.is_done = true
  invoice.value.has_debt = invoice.value.total !== invoice.value.total_paid
  await invoicerStore.updateInvoice(invoice.value!)
  for (const product of invoice.value.products) {
    await ProductModel.db.get<Product>(product._id!).then((dbProduct) => {
      dbProduct.stock -= product.quantity
      return ProductModel.db.put(dbProduct)
    })
  }
  const printInvoice = { ...invoice.value }
  await cashStore.processInvoice(invoice.value!)
  loader.hide()
  await invoicerStore.loadInvoices()
  modal.value.close()
  invoicerStore.setPrintingInvoice(printInvoice)
}

const customer = ref<Customer>({
  name: '',
  phone: ''
})

const options = ref({
  credit: false
})

const setCustomer = (value: Customer | null) => {
  if (!value) {
    customer.value = {
      name: '',
      phone: ''
    }
    return
  }
  customer.value = value
}

const clearInvoice = () => {
  invoicerStore.setInvoice(null)
}

watch(invoice, () => {
  if (invoice.value) {
    modal.value.open()
    if (invoice.value.customer) {
      setCustomer(invoice.value.customer)
    }
  } else {
    modal.value.close()
  }
})

const isValid = computed(() => {
  return customer.value._id !== null || customer.value.name !== ''
})
</script>

<template>
  <side-modal ref="modal" @close="clearInvoice">
    <app-autocomplete
      v-model="customer.name"
      @on-select="setCustomer"
      @on-clear="setCustomer(null)"
    />
    <app-input label="Telefono" v-model="customer.phone" />

    <table class="table-auto w-full mt-3">
      <tr class="table-row">
        <th class="border px-4 py-2">Q</th>
        <th class="border px-4 py-2">Producto</th>
        <th class="border px-4 py-2 text-right">Precio</th>
      </tr>
      <tr v-for="product in invoice?.products" :key="product._id!.toString()">
        <td class="border px-4 py-2">{{ product.quantity }}</td>
        <td class="border px-4 py-2">{{ product.name }}</td>
        <td class="border px-4 py-2 text-right">{{ currencyFormat(product.price) }}</td>
      </tr>
      <tr>
        <td colspan="2" class="border px-4 py-2 text-right">Total</td>
        <td class="border px-4 py-2 text-right">{{ currencyFormat(invoice!.total) }}</td>
      </tr>
    </table>

    <div class="grid grid-cols-2 gap-2 py-3.5">
      <app-checkbox v-model="options.credit">Credito?</app-checkbox>
    </div>
    <app-input label="Abono" v-if="options.credit" v-model.number="invoice!.total_paid" />

    <div class="text-right pt-2">
      <app-button @click="save" :disabled="!isValid">Finalizar</app-button>
    </div>
  </side-modal>
</template>

<style scoped></style>
