import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CashSession } from '@/database/cash-session'
import type { Invoice } from '@/database/invoice'
import type { Purchase } from '@/database/purchase'
import { CashCollection } from '@/database/cash'
import { CashSessionCollection } from '@/database/cash-session'

export const useCashStore = defineStore('cash', () => {
  const session = ref<CashSession>()
  const isChecked = ref(false)

  const loadSession = async () => {
    const _session = await CashSessionCollection.findOne({ status: 'open' })
    console.log(_session)
    if (_session) {
      session.value = _session
    }
    isChecked.value = true
    return new Promise((resolve) => {
      resolve(session.value)
    })
  }

  const persistSession = async () => {
    if (session.value) {
      await CashSessionCollection.updateOne(
        {
          _id: session.value._id
        },
        {
          $set: session.value
        }
      )
    }
  }

  const openSession = async (cash_opened: number) => {
    session.value = {
      start: new Date(),
      end: new Date(),
      cash_opened,
      cash_closed: cash_opened,
      total_debt: 0,
      total_paid: 0,
      total_invoices: 0,
      total_purchases: 0,
      total_dept_paid: 0,
      status: 'open'
    }
    await CashCollection.insertOne({
      description: 'Apertura Caja',
      amount: cash_opened,
      date: new Date(),
      type: 'credit'
    })
    const _ = await CashSessionCollection.insertOne(session.value)
    session.value = {
      ...session.value,
      _id: _.insertedId
    }
  }

  const closeSession = () => {
    session.value!.end = new Date()
    session.value!.status = 'closed'
    session.value = undefined
  }

  const processInvoice = async (invoice: Invoice) => {
    if (session.value) {
      session.value.total_debt += invoice.total - invoice.total_paid
      session.value.total_invoices += invoice.total
      session.value.total_paid += invoice.total_paid
      session.value.cash_closed += invoice.total_paid
    }

    await CashCollection.insertOne({
      description: 'Ingreso Venta N°' + invoice.number,
      amount: invoice.total_paid,
      date: new Date(),
      type: 'credit'
    })

    await persistSession()
  }

  const processBillPayment = async (amount: number, customerName: string) => {
    console.log(Boolean(session.value), session.value)
    if (session.value) {
      session.value.total_paid += amount
      session.value.total_dept_paid += amount
      session.value.cash_closed += amount
      console.log(session.value)
    }

    await CashCollection.insertOne({
      description: 'Pago credito de: ' + customerName,
      amount: amount,
      date: new Date(),
      type: 'credit'
    })

    await persistSession()
  }

  const processPurchase = (purchase: Purchase) => {
    if (session.value) {
      session.value.total_purchases -= purchase.total
      session.value.total_paid -= purchase.total_paid
      session.value.cash_closed -= purchase.total_paid
    }
  }

  return {
    session,
    isChecked,
    loadSession,
    openSession,
    closeSession,
    processInvoice,
    processPurchase,
    processBillPayment,
    persistSession
  }
})
