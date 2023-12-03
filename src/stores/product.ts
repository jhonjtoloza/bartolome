import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ProductCollection } from '@/database/product'
import type { Product } from '@/database/product'
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const loadProducts = async () => {
    ProductCollection.find({}).then((data) => {
      products.value = data
    })
  }

  const saveProduct = async (model: Product) => {
    return ProductCollection.updateOne(
      {
        _id: model._id
      },
      {
        $set: model
      },
      {
        upsert: true
      }
    )
  }

  return {
    products,
    loadProducts,
    saveProduct
  }
})
