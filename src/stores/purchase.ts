import { defineStore } from 'pinia'
import type { Purchase, PurchaseProduct } from '@/database/purchase'
import { ref } from 'vue'
import { PurchaseCollection } from '@/database/purchase'
import { ProductCollection } from '@/database/product'

export const usePurchaseStore = defineStore('purchase', () => {
  const purchase = ref<Purchase>()

  const addPurchase = (model: Purchase) => {
    purchase.value = model
  }

  const addProduct = (model: PurchaseProduct) => {
    if (!purchase.value) {
      return false
    }
    const product = purchase.value.products.find(
      (product) => product._id!.toString() === model._id!.toString()
    )
    if (product) {
      return false
    } else {
      purchase.value.products.push(model)
    }
    purchase.value.total = total()
    return true
  }

  const removeProduct = (index: number) => {
    if (!purchase.value) {
      return
    }
    purchase.value.products.splice(index, 1)
    purchase.value.total = total()
  }

  const updatePurchase = (model: Purchase) => {
    purchase.value = model
  }

  const total = () => {
    if (!purchase.value) {
      return 0
    }
    let total = 0
    purchase.value.products.forEach((product) => {
      total += product.total
    })
    return total
  }

  const savePurchase = async () => {
    if (!purchase.value) {
      return
    }

    for (const product of purchase.value.products) {
      await ProductCollection.updateOne(
        {
          _id: product._id
        },
        {
          $inc: {
            stock: product.quantity
          }
        }
      )
    }

    return await PurchaseCollection.insertOne({
      ...purchase.value
    })
  }

  const clearPurchase = () => {
    purchase.value = undefined
  }

  return {
    purchase,
    addPurchase,
    updatePurchase,
    savePurchase,
    addProduct,
    removeProduct,
    clearPurchase
  }
})
