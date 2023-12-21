<script setup lang="ts">
import { useInvoicerStore } from '@/stores/invoicer'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AppInput from '@/components/form/AppInput.vue'
import AppAutocomplete from '@/components/form/AppAutocomplete.vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import { currencyFormat } from '@/util/currency-format'
import AppCheckbox from '@/components/form/AppCheckbox.vue'
import { type Product, ProductModel } from '@/database/product'
import { useCashStore } from '@/stores/cash'
import type { InvoiceProduct } from '@/database/invoice'
import IconClose from '@/components/icons/IconClose.vue'

const invoicerStore = useInvoicerStore()
const cashStore = useCashStore()

const { invoice } = storeToRefs(invoicerStore)
const customerSearch = ref<InstanceType<typeof AppAutocomplete>>()

const save = async () => {
  if (!invoice.value) {
    return
  }
  invoice.value.customer = await CustomerModel.insertOrUpdate(customer.value)

  if (isCredit.value && cash.value.amount < invoice.value.total) {
    CustomerModel.db.get<Customer>(customer.value._id!).then((dbCustomer) => {
      dbCustomer.has_debt = true
      return CustomerModel.db.put(dbCustomer)
    })
  }
  invoice.value.number = await invoicerStore.getNextInvoiceNumber()
  invoice.value.customer = customer.value
  invoice.value.total_paid = !isCredit.value
    ? invoice.value.total - invoice.value.discount
    : cash.value.amount
  invoice.value.is_done = true
  invoice.value.has_debt = isCredit.value
  await invoicerStore.updateInvoice(invoice.value)
  invoicerStore
    .discountOfStock(invoice.value)
    .catch((error) => {
      console.error(error)
    })
    .then()
  const printInvoice = { ...invoice.value }
  cashStore
    .processInvoice(invoice.value!)
    .then(() => {
      console.log('invoices.processed')
    })
    .catch((error) => {
      console.error(error)
    })

  invoicerStore
    .loadInvoices()
    .then(() => {
      console.log('invoices.loaded')
    })
    .catch((error) => {
      console.error(error)
    })
  invoicerStore.setPrintingInvoice(printInvoice)
  invoicerStore.setInvoice(null)
}

const customer = ref<Customer>({
  name: '',
  phone: ''
})
const cash = ref({
  amount: 0
})

const discount = computed({
  get: () => invoice.value?.discount || 0,
  set: (value) => {
    invoice.value!.discount = value
    invoicerStore.updateInvoice(invoice.value!)
  }
})

const isCredit = ref(false)
const applyDiscount = ref(false)

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

const modifyQuantity = (item: InvoiceProduct, quantity: number) => {
  item.quantity += quantity
  if (item.quantity <= 0) {
    invoicerStore.deleteProduct(item)
    return
  }
  item.total = item.price * item.quantity
  item.income = (item.price - item.cost) * item.quantity
  invoicerStore.updateProduct(item)
}
const addCash = (value: number) => {
  cash.value.amount += value
}

const isValid = computed(() => {
  const whenCredit = (isCredit.value && cash.value.amount < invoice.value!.total) || !isCredit.value
  const whenCustomer = Boolean(customer.value._id || customer.value.name !== '')
  const whenCash =
    (!isCredit.value && cash.value.amount >= invoice.value!.total - invoice.value!.discount) ||
    isCredit.value
  console.log({ whenCredit, whenCustomer, whenCash })
  return [whenCredit, whenCustomer, whenCash].every((value) => Boolean(value))
})

const read = ref()
const height = ref(0)

const total = computed(() => {
  return invoice.value!.total - invoice.value!.discount
})

onMounted(() => {
  read.value = window.setInterval(() => {
    height.value = (document.querySelector('#invoicer .bg-white')?.clientHeight || 0) - 90
    if (height.value > 0) {
      window.clearInterval(read.value)
    }
  })
})

watch(customer, () => {
  invoice.value!.customer = customer.value
  invoicerStore.updateInvoice(invoice.value!)
})

watch(
  invoice,
  () => {
    if (!invoice.value) {
      return
    }
    nextTick(() => {
      if (!invoice.value?.customer?.name) {
        return
      }
      if (invoice.value.discount > 0) {
        applyDiscount.value = true
      }
      customerSearch.value!.setCustomer(invoice.value!.customer)
      setCustomer(invoice.value!.customer)
      cash.value.amount = 0
    })
  },
  { immediate: true }
)

watch(applyDiscount, () => {
  if (!applyDiscount.value) {
    invoice.value!.discount = 0
  }
})
</script>

<template>
  <div class="flex flex-col flex-1 shadow-xl rounded-3xl overflow-y-scroll" v-if="invoice">
    <div class="py-2 px-5 gap-2 flex justify-between items-center bg-blue-800">
      <h5 class="text-base font-semibold text-zinc-100 uppercase dark:text-gray-100 flex">
        Factura:
        {{
          invoice.location === 'table'
            ? '' + invoice.table!.name
            : 'Barra ' + invoice.customer!.name
        }}
      </h5>
      <button class="rounded bg-blue-600 p-2 hover:bg-blue-900" @click="clearInvoice">
        <icon-close class="fill-amber-50" />
      </button>
    </div>
    <div class="bg-white p-4 overflow-y-scroll" :style="{ height: height + 'px' }">
      <div>
        <div class="pb-2">
          <app-autocomplete
            ref="customerSearch"
            v-model="customer.name"
            @on-select="setCustomer"
            @on-clear="setCustomer(null)"
          />
          <app-input label="Telefono" v-model="customer.phone" />
        </div>
      </div>
      <div
        v-for="item in invoice?.products"
        class="select-none mb-3 bg-blue-50 rounded-lg w-full text-zinc-900 py-2 px-2 flex justify-center"
      >
        <img :src="item.image" alt="" class="rounded-lg h-10 w-10 bg-white shadow mr-2" />
        <div class="flex-grow">
          <h5 class="text-sm">{{ item.name }}</h5>
          <p class="text-xs block">
            {{ currencyFormat(item.price) }}
          </p>
        </div>
        <div class="py-1">
          <div class="w-28 grid grid-cols-3 gap-2 ml-2">
            <button
              @click="modifyQuantity(item, -1)"
              class="rounded-lg text-center py-1 text-white bg-blue-700 hover:bg-blue-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-3 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                ></path>
              </svg>
            </button>
            <input
              v-model.number="item.quantity"
              type="text"
              class="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
            />
            <button
              @click="modifyQuantity(item, 1)"
              class="rounded-lg text-center py-1 text-white bg-blue-700 hover:bg-blue-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-3 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="w-full py-3.5">
        <app-checkbox class="mb-1" v-model="isCredit">Aplicar como credito</app-checkbox>
        <app-checkbox v-model="applyDiscount">Aplicar descuento</app-checkbox>
      </div>

      <div class="select-none h-auto w-full text-center pb-4">
        <div class="mb-3 text-blue-gray-700 px-3 pt-2 pb-3 rounded-lg bg-blue-50">
          <div class="flex text-lg font-semibold mb-2" v-if="applyDiscount">
            <div class="flex-grow text-left">Descuento</div>
            <div class="flex text-right">
              <div class="mr-2">$</div>
              <input
                v-model.number="discount"
                type="text"
                class="w-28 text-right bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex text-lg font-semibold mb-2">
            <div class="flex-grow text-left">{{ isCredit ? 'Abono' : 'Efectivo' }}</div>
            <div class="flex text-right">
              <div class="mr-2">$</div>
              <input
                v-model.number="cash.amount"
                type="text"
                class="w-28 text-right bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex text-lg font-semibold">
            <div class="flex-grow text-left">Total</div>
            <div class="flex text-right">
              {{ currencyFormat(total) }}
            </div>
          </div>
          <hr class="my-2" />
          <div class="grid grid-cols-3 gap-2 mt-2">
            <template v-for="money of [2000, 5000, 10000, 20000, 50000, 100000]">
              <button
                @click="addCash(money)"
                class="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm"
              >
                +<span>{{ currencyFormat(money) }}</span>
              </button>
            </template>
          </div>
        </div>
        <div
          class="flex mb-3 text-lg font-semibold bg-cyan-50 text-blue-gray-700 rounded-lg py-2 px-3"
          :class="[]"
        >
          <div class="text-cyan-800">Cambio</div>
          <div class="text-right flex-grow text-cyan-600">
            {{ currencyFormat(cash.amount - (invoice!.total - invoice!.discount)) }}
          </div>
        </div>
        <button
          class="text-white rounded-2xl text-lg w-full py-3 bg-blue-700 cursor-pointer focus:outline-none disabled:bg-blue-200"
          :disabled="!isValid"
          @click="save()"
        >
          Finalizar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
