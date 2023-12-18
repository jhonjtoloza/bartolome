import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/database/product'
import { ProductModel } from '@/database/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const loadProducts = async () => {
    ProductModel.find().then((data) => {
      products.value = data
    })
  }

  const saveProduct = async (model: Product) => {
    await ProductModel.insertOrUpdate(model)

    await loadProducts()
  }

  return {
    products,
    loadProducts,
    saveProduct
  }
})
