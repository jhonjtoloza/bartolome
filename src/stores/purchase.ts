import { defineStore } from 'pinia'
import type { Purchase, PurchaseProduct } from '@/database/purchase'
import { ref } from 'vue'
import { PurchaseModel } from '@/database/purchase'
import { ProductModel } from '@/database/product'

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
      await ProductModel.findOne(product._id!).then(async (model) => {
        if (model) {
          product.price = model.price
          product.stock += product.quantity

          await ProductModel.insertOrUpdate(product)
        }
      })
    }

    return await PurchaseModel.insertOrUpdate({
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
