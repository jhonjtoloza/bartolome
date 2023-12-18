import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Invoice, InvoiceProduct } from '@/database/invoice'
import { InvoiceModel } from '@/database/invoice'
import type { Product } from '@/database/product'

export const useInvoicerStore = defineStore('invoicer', () => {
  const invoices = ref<Invoice[]>([])
  const product = ref<InvoiceProduct | null>(null)
  const invoice = ref<Invoice | null>(null)
  const printingInvoice = ref<Invoice | null>(null)
  const loadInvoices = async () => {
    await InvoiceModel.db.createIndex({ index: { fields: ['is_done'] } })
    InvoiceModel.db
      .find({
        selector: {
          is_done: false
        }
      })
      .then((data) => {
        invoices.value = data.docs as unknown as Invoice[]
      })
  }

  const addInvoice = async (model: Invoice) => {
    const { id } = await InvoiceModel.insertOrUpdate({
      ...model
    })
    await loadInvoices()
    return await InvoiceModel.findOne(id)
  }

  const updateTotal = (invoice: Invoice) => {
    const total = (invoice: Invoice) => {
      let total = 0
      invoice.products.forEach((product) => {
        total += product.total
      })
      invoice.total = total
    }

    const income = (invoice: Invoice) => {
      let income = 0
      invoice.products.forEach((product) => {
        income += product.income
      })
      invoice.total_income = income - invoice.discount
    }
    total(invoice)
    income(invoice)
  }

  const addProduct = async (_invoice: Invoice, model: InvoiceProduct) => {
    const product = _invoice.products.find(
      (product) => product._id!.toString() === model._id!.toString()
    )
    if (product) {
      _invoice.products.forEach((product) => {
        if (product._id!.toString() === model._id!.toString()) {
          product.quantity += model.quantity
          product.total += model.total
          product.income += model.income
        }
      })
    } else {
      _invoice.products.push(model)
    }
    updateTotal(_invoice)
    const response = await InvoiceModel.insertOrUpdate(_invoice)
    if (invoice.value && invoice.value?._id! === _invoice._id) {
      invoice.value = { ...invoice.value, _rev: response.rev }
    }
    await loadInvoices()
    return _invoice
  }

  const deleteProduct = async (model: InvoiceProduct) => {
    if (!invoice.value) {
      return false
    }
    invoice.value.products = invoice.value.products.filter((product) => product._id !== model._id)
    updateTotal(invoice.value)
    const response = await InvoiceModel.insertOrUpdate(invoice.value)
    invoice.value = { ...invoice.value, _rev: response.rev }
    await loadInvoices()
  }

  const updateProduct = async (model: InvoiceProduct) => {
    if (!invoice.value) {
      return false
    }
    invoice.value.products.forEach((product) => {
      if (product._id!.toString() === model._id!.toString()) {
        product.quantity = model.quantity
        product.total = model.total
        product.income = model.income
      }
    })
    updateTotal(invoice.value)
    const response = await InvoiceModel.insertOrUpdate(invoice.value)
    invoice.value = { ...invoice.value, _rev: response.rev }
    await loadInvoices()
  }

  const setInvoice = (model: Invoice | null) => {
    invoice.value = model
  }

  const updateInvoice = async (model: Invoice) => {
    const response = await InvoiceModel.insertOrUpdate(model)
    if (invoice.value && invoice.value?._id! === model._id) {
      invoice.value = { ...invoice.value, _rev: response.rev }
    }
    await loadInvoices()
  }

  const setDragging = async (model: Product) => {
    product.value = {
      ...model,
      quantity: 1,
      total: model.price,
      income: model.price - model.price
    }
  }

  const deleteInvoice = async (model: Invoice) => {
    await InvoiceModel.deleteOne(model)
    await loadInvoices()
  }

  const getNextInvoiceNumber = async (): Promise<number> => {
    return (await InvoiceModel.db.info()).doc_count + 1
  }

  const setPrintingInvoice = (model: Invoice | null) => {
    console.log('setPrintingInvoice', model)
    printingInvoice.value = model
  }

  return {
    invoices,
    product,
    invoice,
    printingInvoice,
    loadInvoices,
    addInvoice,
    addProduct,
    updateProduct,
    deleteProduct,
    setDragging,
    setInvoice,
    updateInvoice,
    deleteInvoice,
    getNextInvoiceNumber,
    setPrintingInvoice
  }
})
