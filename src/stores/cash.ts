import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CashSession } from '@/database/cash-session'
import type { Invoice } from '@/database/invoice'
import type { Purchase } from '@/database/purchase'
import { CashModel } from '@/database/cash'
import { CashSessionModel } from '@/database/cash-session'
import { useUserStore } from '@/stores/user'

export const useCashStore = defineStore('cash', () => {
  const session = ref<CashSession | null>(null)
  const isChecked = ref(false)

  const loadSession = async () => {
    const _session = await CashSessionModel.findOne({ status: 'open' })
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
      await CashSessionModel.insertOrUpdate(session.value)
    }
  }

  const openSession = async (cash_opened: number) => {
    const { user } = useUserStore()

    session.value = {
      user: user!.username,
      start: new Date().getTime(),
      end: new Date().getTime(),
      cash_opened,
      cash_closed: cash_opened,
      total_debt: 0,
      total_paid: 0,
      total_invoices: 0,
      total_purchases: 0,
      total_dept_paid: 0,
      total_discount: 0,
      total_income: 0,
      status: 'open'
    }
    await CashModel.insertOrUpdate({
      description: 'Apertura Caja',
      amount: cash_opened,
      date: new Date().getTime(),
      type: 'credit'
    })
    const _ = await CashSessionModel.insertOrUpdate(session.value)
    session.value = {
      ...session.value,
      _id: _.id
    }
  }

  const closeSession = async () => {
    session.value!.end = new Date().getTime()
    session.value!.status = 'closed'
    await CashSessionModel.insertOrUpdate(session.value!)
    session.value = null
  }

  const processInvoice = async (invoice: Invoice) => {
    if (session.value) {
      session.value.total_debt += invoice.total - invoice.discount - invoice.total_paid
      session.value.total_invoices += invoice.total
      session.value.total_paid += invoice.total_paid
      session.value.cash_closed += invoice.total_paid
      session.value.total_discount += invoice.discount
      session.value.total_income += invoice.total_income
    }

    await CashModel.insertOrUpdate({
      description: 'Ingreso Venta N°' + invoice.number,
      amount: invoice.total_paid,
      date: new Date().getTime(),
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

    await CashModel.insertOrUpdate({
      description: 'Pago credito de: ' + customerName,
      amount: amount,
      date: new Date().getTime(),
      type: 'credit'
    })

    await persistSession()
  }

  const processPurchase = async (purchase: Purchase) => {
    if (session.value) {
      session.value.total_purchases -= purchase.total
      session.value.total_paid -= purchase.total_paid
      session.value.cash_closed -= purchase.total_paid
      await persistSession()
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
