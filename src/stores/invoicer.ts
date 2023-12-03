import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Invoice, InvoiceProduct } from '@/database/invoice'
import { InvoiceCollection } from '@/database/invoice'
import type { Product } from '@/database/product'

export const useInvoicerStore = defineStore('invoicer', () => {
  const invoices = ref<Invoice[]>([])
  const product = ref<InvoiceProduct | null>(null)
  const invoice = ref<Invoice | null>(null)
  const loadInvoices = async () => {
    return await InvoiceCollection.find({ is_done: false }).then((data) => {
      invoices.value = data
    })
  }

  const addInvoice = async (model: Invoice) => {
    const { insertedId } = await InvoiceCollection.insertOne({
      ...model
    })
    await loadInvoices()
    return await InvoiceCollection.findOne({ _id: insertedId })
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
    await InvoiceCollection.updateOne(
      {
        _id: invoice._id
      },
      {
        $set: invoice
      }
    )

    return invoice
  }

  const setInvoice = (model: Invoice | null) => {
    invoice.value = model
  }

  const updateInvoice = async (model: Invoice) => {
    await InvoiceCollection.updateOne(
      {
        _id: model._id
      },
      {
        $set: {
          ...model
        }
      }
    )
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
    await InvoiceCollection.deleteOne({
      _id: model._id
    })
    await loadInvoices()
  }

  const getNextInvoiceNumber = async (): Promise<number> => {
    return (await InvoiceCollection.count()) + 1
  }

  return {
    invoices,
    product,
    invoice,
    loadInvoices,
    addInvoice,
    addProduct,
    setDragging,
    setInvoice,
    updateInvoice,
    deleteInvoice,
    getNextInvoiceNumber
  }
})
