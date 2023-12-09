<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { Customer } from '@/database/customer'
import { CustomerModel } from '@/database/customer'
import { ObjectId } from '@/database/connection'
import type { Invoice } from '@/database/invoice'
import { InvoiceModel } from '@/database/invoice'
import AppInput from '@/components/form/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppTitle from '@/components/AppTitle.vue'
import { useLoading } from 'vue3-loading-overlay'
import { useCashStore } from '@/stores/cash'
import { dateFormat } from '@/util/date-format'
import { currencyFormat } from '@/util/currency-format'

const loader = useLoading()
const cashStore = useCashStore()

const { id } = useRoute().params

const customer = ref<Customer>()
const invoices = ref<Invoice[]>([])

const setCustomer = (value: Customer | null) => {
  console.log(value)
  if (!value) {
    useRouter().replace({ name: 'customers' })
  }
  customer.value = value!
  if (value?.has_debt) {
    loadInvoices()
  }
}

const loadInvoices = async () => {
  InvoiceModel.db
    .find({
      selector: {
        'customer._id': customer.value?._id,
        has_debt: true
      }
    })
    .then((data) => {
      console.log(data)
      invoices.value = data.docs
    })
}

const total = computed(() => {
  let total = 0
  invoices.value.forEach((invoice) => {
    total += invoice.total
  })
  return total
})

const totalPaid = computed(() => {
  let total = 0
  invoices.value.forEach((invoice) => {
    total += invoice.total_paid
  })
  return total
})

const totalDebt = computed(() => {
  return total.value - totalPaid.value
})

const amount = ref(0)

const makeBillPayment = async () => {
  loader.show()
  let remaining = amount.value
  for (const invoice of invoices.value) {
    const dept = Math.min(remaining, invoice.total - invoice.total_paid)
    remaining -= dept
    invoice.total_paid += dept
    await InvoiceModel.db.put({
      _id: invoice._id,
      ...invoice
    })
    if (remaining === 0) {
      loadInvoices().then(() => {
        checkDebt()
      })
      break
    }
  }

  await cashStore.processBillPayment(amount.value, customer.value!.name)

  amount.value = 0
  loader.hide()
}

const checkDebt = async () => {
  if (totalDebt.value === 0) {
    await CustomerModel.insertOne({
      ...customer.value,
      has_debt: false
    } as Customer)
  }
}

onMounted(() => {
  CustomerModel.findOne(id as string).then(setCustomer)
})
</script>

<template>
  <app-card :title="customer?.name">
    <div v-if="customer" class="grid grid-cols-6 gap-6">
      <div class="col-span-2">
        <app-card title="Informacion">
          <template #header>
            <app-title>Informacion</app-title>
          </template>
          <table class="w-full">
            <tr>
              <th class="border border-gray-300 p-1.5">Nombre</th>
              <td class="border border-gray-300 p-1.5">{{ customer.name }}</td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-1.5">Telefono</th>
              <td class="border border-gray-300 p-1.5">{{ customer.phone }}</td>
            </tr>
            <tr>
              <th class="border border-gray-300 p-1.5">Credito</th>
              <td class="border border-gray-300 p-1.5">{{ customer.has_debt ? 'Si' : 'No' }}</td>
            </tr>
          </table>
        </app-card>
      </div>
      <div class="col-span-4">
        <app-card>
          <template #header>
            <app-title>Facturas</app-title>
          </template>
          <table class="w-full">
            <thead>
              <tr>
                <th class="border border-gray-300 p-1.5">Numero</th>
                <th class="border border-gray-300 p-1.5">Fecha</th>
                <th class="border border-gray-300 p-1.5">Total</th>
                <th class="border border-gray-300 p-1.5">Deuda total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in invoices" :key="invoice._id!.toString()">
                <td class="border border-gray-300 p-1">{{ invoice.number }}</td>
                <td class="border border-gray-300 p-1">{{ dateFormat(invoice.date) }}</td>
                <td class="border border-gray-300 p-1 text-right">
                  {{ currencyFormat(invoice.total) }}
                </td>
                <td class="border border-gray-300 p-1 text-right">
                  {{ currencyFormat(invoice.total - invoice.total_paid) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="border border-gray-300 p-1.5 text-right" colspan="3">Total facturado</th>
                <th class="border border-gray-300 p-1.5 text-right">
                  {{ currencyFormat(total) }}
                </th>
              </tr>
              <tr>
                <th class="border border-gray-300 p-1.5 text-right" colspan="3">Total pagado</th>
                <th class="border border-gray-300 p-1.5 text-right">
                  {{ currencyFormat(totalPaid) }}
                </th>
              </tr>
              <tr>
                <th class="border border-gray-300 p-1.5 text-right" colspan="3">Total deuda</th>
                <th class="border border-gray-300 p-1.5 text-right">
                  {{ currencyFormat(totalDebt) }}
                </th>
              </tr>
            </tfoot>
          </table>
          <hr class="border my-2.5" />
          <h1 class="text-2xl text-blue-800">Hacer un abono</h1>
          <form class="" @submit.prevent="makeBillPayment">
            <app-input class="col-span-2" label="Monto" v-model.number="amount" />
            <div class="col-span-2 text-right mt-2.5">
              <app-button type="submit" :disabled="amount == 0 || amount > totalDebt"
                >Hacer abono
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </div>
  </app-card>
</template>
