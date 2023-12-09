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
    console.log('loadInvoices')
    await InvoiceModel.db.createIndex({ index: { fields: ['is_done'] } })
    InvoiceModel.db
      .find({
        selector: {
          is_done: false
        }
      })
      .then((data) => {
        console.log(data.docs)
        invoices.value = data.docs as unknown as Invoice[]
      })
  }

  const addInvoice = async (model: Invoice) => {
    const { id } = await InvoiceModel.insertOne({
      ...model
    })
    await loadInvoices()
    return await InvoiceModel.findOne(id)
  }

  const total = (invoice: Invoice) => {
    let total = 0
    invoice.products.forEach((product) => {
      total += product.total
    })
    return total
  }

  const addProduct = async (invoice: Invoice, model: InvoiceProduct) => {
    const product = invoice.products.find(
      (product) => product._id!.toString() === model._id!.toString()
    )
    if (product) {
      invoice.products.forEach((product) => {
        if (product._id!.toString() === model._id!.toString()) {
          product.quantity += model.quantity
          product.total += model.total
        }
      })
    } else {
      invoice.products.push(model)
    }
    invoice.total = total(invoice)
    await InvoiceModel.insertOne(invoice)

    return invoice
  }

  const setInvoice = (model: Invoice | null) => {
    invoice.value = model
  }

  const updateInvoice = async (model: Invoice) => {
    await InvoiceModel.insertOne(model)
    await loadInvoices()
  }

  const setDragging = (model: Product) => {
    product.value = {
      ...model,
      quantity: 1,
      total: model.price
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
    setDragging,
    setInvoice,
    updateInvoice,
    deleteInvoice,
    getNextInvoiceNumber,
    setPrintingInvoice
  }
})
