import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ProductCollection } from '@/database/product'
import type { Product } from '@/database/product'
import type { WithId } from 'mongodb'
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const loadProducts = async () => {
    ProductCollection.find({}).then((data) => {
      products.value = data
    })
  }

  const saveProduct = async (model: Product) => {
    if (model._id) {
      await ProductCollection.updateOne(
        {
          _id: model._id
        },
        {
          $set: model
        }
      )
    } else {
      await ProductCollection.insertOne(model)
    }
    await loadProducts()
  }

  return {
    products,
    loadProducts,
    saveProduct
  }
})
